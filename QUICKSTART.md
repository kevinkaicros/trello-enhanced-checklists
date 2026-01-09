# Quick Start Guide - Enhanced Checklists Power-Up

Get your Enhanced Checklists Power-Up running in 10 minutes!

## 🚀 Fast Setup (3 Steps)

### Step 1: Deploy to GitHub Pages (5 minutes)

```bash
# 1. Create a new repository on GitHub (e.g., "trello-enhanced-checklists")

# 2. Initialize git in this folder
cd trello-enhanced-checklists
git init
git add .
git commit -m "Initial commit: Enhanced Checklists Power-Up"

# 3. Connect to your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main

# 4. Enable GitHub Pages
# Go to: Settings > Pages > Select "main" branch > Save
```

Your Power-Up will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### Step 2: Register Power-Up (3 minutes)

1. Visit: https://trello.com/power-ups/admin
2. Click "Create new Power-Up"
3. Fill in:
   - **Name**: Enhanced Checklists
   - **Iframe connector URL**: `https://YOUR_USERNAME.github.io/YOUR_REPO/index.html`
4. Enable capabilities:
   - ✅ Card Buttons
   - ✅ Card Badges
   - ✅ Show Settings
5. Copy your **API Key**

### Step 3: Configure API Key (2 minutes)

1. Edit `js/client.js` (line 88)
2. Replace `'YOUR_APP_KEY_HERE'` with your actual API Key
3. Commit and push:
   ```bash
   git add js/client.js
   git commit -m "Add API key"
   git push
   ```

## ✅ You're Done!

Enable the Power-Up on your board:
1. Open any Trello board
2. Click "Power-Ups" menu
3. Click "Add Power-Ups"
4. Find "Enhanced Checklists" in "Custom" section
5. Click "Add"

## 🎯 First Use

1. Create a card with a checklist
2. Click "Manage Enhanced Checklists" button on the card
3. Select a checklist item
4. Add a description or sublist items
5. See the badges appear on the card front!

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Power-Up not appearing | Wait 2-3 minutes for GitHub Pages to deploy, then hard refresh (Ctrl+Shift+R) |
| "Failed to load" error | Check that URL ends with `/index.html` in Power-Up settings |
| Changes not showing | Clear browser cache or use incognito mode |
| API Key error | Make sure you copied the entire key without extra spaces |

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize colors in `css/styles.css`
- Modify the icon in `icons/icon.svg`
- Add more features by extending the JavaScript files

## 💡 Pro Tips

1. **Use incognito mode** when testing changes to avoid caching issues
2. **Check browser console** (F12) for any error messages
3. **Test on a demo board** first before using on real projects
4. **Share the Power-Up** by adding collaborators to your Trello workspace

## 🔗 Helpful Links

- [Trello Power-Up Documentation](https://developer.atlassian.com/cloud/trello/)
- [GitHub Pages Guide](https://pages.github.com/)
- [Trello Power-Up Admin](https://trello.com/power-ups/admin)

---

Need help? Check the [full README](README.md) or open an issue!
