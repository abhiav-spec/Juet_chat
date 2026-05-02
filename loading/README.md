# bolchal Loading Page - Simple Edition

**Minimal static HTML/CSS/JS loading page that redirects to your EC2 app.**

## 📁 Files

```
landing-page-simple/
├── index.html          # HTML page
├── style.css           # CSS styling
├── script.js           # JavaScript redirect logic
└── README.md           # This file
```

## ✨ Features

- ✅ Pure HTML/CSS/JavaScript (NO npm, NO dependencies)
- ✅ Premium loading animation with bokeh effects
- ✅ Auto-redirect to `http://35.175.213.18:3000/` after 2.5s
- ✅ 5-second countdown timer
- ✅ Click anywhere to redirect immediately
- ✅ Fully responsive design

## 🚀 Deployment (Choose One)

### Option 1: Vercel (Easiest)

```bash
cd landing-page-simple
vercel
```

Follow the prompts and done!

### Option 2: GitHub Pages (Free)

```bash
cd landing-page-simple
git init
git add .
git commit -m "Initial landing page"
git remote add origin https://github.com/YOUR_USERNAME/bolchal-landing.git
git branch -M main
git push -u origin main
```

Then in GitHub:
- Settings → Pages
- Source: main branch
- Your site is live at: `https://YOUR_USERNAME.github.io/bolchal-landing`

### Option 3: Netlify (Drag & Drop)

1. Go to [netlify.com](https://netlify.com)
2. Click "New site" → "Deploy manually"
3. Drag & drop the entire `landing-page-simple` folder
4. Done!

### Option 4: Simple Python Server (Local Testing)

```bash
cd landing-page-simple
python3 -m http.server 3001
# Visit http://localhost:3001
```

### Option 5: Node.js http-server

```bash
cd landing-page-simple
npx http-server . -p 3001
# Visit http://localhost:3001
```

## ⚙️ Configuration

To change the redirect URL, edit `script.js`:

```javascript
const CONFIG = {
  REDIRECT_URL: 'http://35.175.213.18:3000/',  // ← Change this
  LOADING_DURATION: 2500,
  COUNTDOWN_DURATION: 5
};
```

## 🎯 User Flow

1. User visits your landing page (Vercel/GitHub Pages URL)
2. Sees premium loading animation (2.5 seconds)
3. Automatically redirects to `http://35.175.213.18:3000/`
4. OR user clicks anywhere to redirect immediately
5. Sees your bolchal chat app login page ✨

## 📊 File Sizes

- `index.html`: ~2 KB
- `style.css`: ~8 KB
- `script.js`: ~0.5 KB

**Total: < 11 KB** → Super fast loading!

## ✅ Testing Checklist

- [ ] Loading animation plays for 2.5 seconds
- [ ] Auto-redirect happens after countdown
- [ ] Can click anywhere to redirect immediately
- [ ] Redirects to correct EC2 URL
- [ ] Works on mobile devices
- [ ] Works on different browsers (Chrome, Safari, Firefox)

## 🔄 Local Development

```bash
# Just open in browser
open index.html

# Or use any local server
python3 -m http.server 3001
```

## 🌐 Live Preview

Once deployed, share your landing page URL (e.g., `https://bolchal-landing.vercel.app`) - users will automatically redirect to your app!

---

**That's it! No npm, no build process, no complexity. Just pure HTML/CSS/JS!**
