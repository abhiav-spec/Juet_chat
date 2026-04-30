import otpGenerator from 'otp-generator';

function generateOTP() {
    return otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
    });
}

function getOtpHtml(otp) {
    return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>One-Time Passcode</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f6f7fb; font-family:Arial, Helvetica, sans-serif; color:#1f2937;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f6f7fb; padding:24px 0;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e7eb;">
                            <tr>
                                <td style="padding:24px 28px; background-color:#0f172a; color:#ffffff;">
                                    <div style="font-size:18px; font-weight:bold; letter-spacing:0.3px;">bolchal</div>
                                    <div style="font-size:13px; opacity:0.85; margin-top:4px;">Secure access verification</div>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:28px;">
                                    <h1 style="font-size:22px; margin:0 0 12px;">Your one-time passcode</h1>
                                    <p style="font-size:15px; line-height:1.6; margin:0 0 16px;">
                                        Use the following code to complete your sign-in. This code is valid for 10 minutes.
                                    </p>
                                    <div style="font-size:28px; font-weight:bold; letter-spacing:6px; background:#f3f4f6; border:1px dashed #d1d5db; padding:12px 18px; text-align:center; border-radius:8px;">
                                        ${otp}
                                    </div>
                                    <p style="font-size:13px; line-height:1.6; color:#6b7280; margin:16px 0 0;">
                                        If you did not request this code, you can safely ignore this email.
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:18px 28px; background-color:#f9fafb; font-size:12px; color:#6b7280;">
                                    This message was sent by bolchal. Please do not reply to this email.
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
    </html>
    `;
}

export { generateOTP, getOtpHtml };