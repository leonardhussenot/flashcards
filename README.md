# Deutsch — Minimalist German Flashcards (PWA)

Offline-first Progressive Web App built for iPhone 16e using **FSRS-5** spaced repetition and on-device `IndexedDB` storage.

## Deploy to GitHub Pages & Install on Your iPhone 16e

1. **Push this project to [`leonardhussenot/flashcards`](https://github.com/leonardhussenot/flashcards):**
   ```bash
   cd /Users/leonardhussenot/.gemini/antigravity/scratch/german-flashcards
   git init -b main
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/leonardhussenot/flashcards.git
   git push -u origin main
   ```
   *(If you use SSH keys with GitHub, replace the remote URL with `git@github.com:leonardhussenot/flashcards.git`.)*

2. **Enable GitHub Pages:**
   - Open https://github.com/leonardhussenot/flashcards/settings/pages
   - Under **Build and deployment → Source**, choose **Deploy from a branch**.
   - Select branch **`main`** and folder **`/ (root)`**, then click **Save**.
   - Wait ~30–60 seconds for the site to go live.

3. **Install on your iPhone 16e:**
   - Open **https://leonardhussenot.github.io/flashcards/** in **Safari** on your iPhone 16e.
   - Tap the **Share** button (bottom bar) → **Add to Home Screen** → **Add**.

## Local Preview

```bash
cd /Users/leonardhussenot/.gemini/antigravity/scratch/german-flashcards
python3 -m http.server 8080
```
Then open http://localhost:8080.
