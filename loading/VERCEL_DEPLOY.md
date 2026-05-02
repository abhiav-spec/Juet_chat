# 🚀 Deploy Loading Page to Vercel

Your loading page is now in `/loading` folder of JUET_chat repo, ready for Vercel deployment.

## Quick Deploy Steps

### Step 1: Go to Vercel Dashboard
- Visit [vercel.com](https://vercel.com)
- Sign in with GitHub

### Step 2: Create New Project
1. Click **"New Project"**
2. Select your **`Juet_chat`** repository
3. Scroll down to **"Configure Project"**
4. Change **Root Directory** from `.` to `loading`
5. Click **"Deploy"**

✅ **Done!** Your loading page is now live!

---

## Your Loading Page URL

After deployment, Vercel will give you a URL like:
```
https://juet-chat-loading.vercel.app
```

---

## How It Works

1. **User visits** loading page URL
2. **Loading animation plays** for 2.5 seconds
3. **Auto-redirects** to `http://35.175.213.18:3000/` (your EC2 app)
4. **Or user clicks** anywhere to redirect immediately

---

## Update Redirect URL (if EC2 IP changes)

Edit `loading/script.js`:

```javascript
const CONFIG = {
  REDIRECT_URL: 'http://35.175.213.18:3000/',  // ← Change this
  LOADING_DURATION: 2500,
  COUNTDOWN_DURATION: 5
};
```

Then push to GitHub:
```bash
git add loading/script.js
git commit -m "Update redirect URL"
git push
```

Vercel auto-deploys on push! ✨

---

## File Structure

```
JUET_chat/
├── backend/            # Backend server
├── frontend/           # React frontend
└── loading/            # ← Your loading page
    ├── index.html      # HTML page
    ├── style.css       # Styling
    ├── script.js       # Redirect logic
    └── README.md       # Docs
```

---

## Deployment Checklist

- [ ] Root Directory set to `loading` in Vercel
- [ ] Loading page deploys successfully
- [ ] Animation plays for 2.5 seconds
- [ ] Auto-redirects to EC2 IP after countdown
- [ ] Can click to redirect immediately
- [ ] Works on mobile devices

---

## Local Testing

```bash
cd loading
python3 -m http.server 3001
# Visit http://localhost:3001
```

---

**Share your Vercel URL as the entry point to your app!** 🎉
