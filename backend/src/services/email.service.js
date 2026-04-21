import nodemailer from 'nodemailer';

/**
 * Priority order:
 *  1. Gmail App Password  (EMAIL_USER + EMAIL_APP_PASSWORD)  ← recommended
 *  2. Gmail OAuth2        (EMAIL_USER + CLIENT_ID + CLIENT_SECRET + REFRESH_TOKEN)
 *  3. Ethereal test account (preview URL printed in console)
 *
 * NOTE: transporter is created fresh on every sendEmail call to avoid
 * stale-credential issues when .env changes between server restarts.
 */

const isAppPasswordConfigured = (user, pass) => Boolean(user && pass);

const isOAuth2Configured = (user, id, secret, token) =>
  Boolean(
    user && id && secret && token
  );

const createTransporter = async () => {
  const emailUser = process.env.EMAIL_USER || process.env.GOOGLE_USER || '';
  const appPassword = (process.env.EMAIL_APP_PASSWORD || process.env.GMAIL_PASS || '').replace(/\s+/g, '');
  const clientId = process.env.CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '';
  const clientSecret = process.env.CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || '';
  const refreshToken = process.env.REFRESH_TOKEN || process.env.GOOGLE_REFRESH_TOKEN || '';

  if (isAppPasswordConfigured(emailUser, appPassword)) {
    console.log('📧 Using Gmail App Password for emails');
    console.log('   User:', emailUser);
    console.log('   Pass set:', !!appPassword);
    return {
      transport: nodemailer.createTransport({
        service: 'gmail',
        logger: process.env.NODE_ENV !== 'production',
        debug: process.env.NODE_ENV !== 'production',
        auth: {
          user: emailUser,
          pass: appPassword,
        },
      }),
      mode: 'apppassword',
      emailUser,
    };
  }

  if (isOAuth2Configured(emailUser, clientId, clientSecret, refreshToken)) {
    console.log('📧 Using Gmail OAuth2 for emails (note: refresh token may expire)');
    return {
      transport: nodemailer.createTransport({
        service: 'gmail',
        logger: process.env.NODE_ENV !== 'production',
        debug: process.env.NODE_ENV !== 'production',
        auth: {
          type: 'OAuth2',
          user: emailUser,
          clientId,
          clientSecret,
          refreshToken,
          accessToken: process.env.ACCESS_TOKEN,
        },
      }),
      mode: 'oauth2',
      emailUser,
    };
  }

  // Fallback: Ethereal test account
  try {
    console.log('🔄 No email credentials found. Generating Ethereal test account...');
    const testAccount = await nodemailer.createTestAccount();
    console.log('✅ Ethereal test account:', testAccount.user);
    return {
      transport: nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
      }),
      mode: 'ethereal',
    };
  } catch (error) {
    console.error('❌ Failed to create Ethereal account:', error.message);
    return null;
  }
};

const sendEmail = async (to, subject, text, html) => {
  const result = await createTransporter();

  if (!result) {
    return { success: false, error: 'Email service not initialized — no credentials found in .env' };
  }

  const { transport, mode, emailUser } = result;
  const fromAddress = (mode === 'apppassword' || mode === 'oauth2')
    ? `"Auth System" <${emailUser}>`
    : '"Auth System" <noreply@auth.example.com>';

  try {
    const info = await transport.sendMail({ from: fromAddress, to, subject, text, html });

    console.log('✉️  Email sent successfully!');
    console.log('   To:', to);
    console.log('   MessageId:', info.messageId);
    console.log('   Response:', info.response || 'n/a');
    console.log('   Accepted:', Array.isArray(info.accepted) ? info.accepted.join(', ') : 'n/a');
    console.log('   Rejected:', Array.isArray(info.rejected) ? info.rejected.join(', ') : 'n/a');

    if (Array.isArray(info.rejected) && info.rejected.length > 0 && (!Array.isArray(info.accepted) || info.accepted.length === 0)) {
      return { success: false, error: `Email rejected by SMTP for recipient(s): ${info.rejected.join(', ')}` };
    }

    if (mode === 'ethereal') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('\n🔗 ETHEREAL PREVIEW (open in browser — nothing was sent to real inbox):');
      console.log('   ' + previewUrl + '\n');
    }

    return {
      success: true,
      messageId: info.messageId,
      accepted: info.accepted || [],
      rejected: info.rejected || [],
      response: info.response || '',
    };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    if (error.message.includes('invalid_grant')) {
      console.error('   ➡  OAuth2 refresh token is EXPIRED. Switch to Gmail App Password instead.');
      console.error('   ➡  Add EMAIL_APP_PASSWORD to your .env (from myaccount.google.com/apppasswords)');
    }
    if (error.message.includes('Username and Password') || error.message.includes('Invalid login')) {
      console.error('   ➡  Gmail rejected the App Password. Check it is correct and 2FA is enabled.');
    }
    return { success: false, error: error.message, accepted: [], rejected: [] };
  }
};

export default sendEmail;