# A Walleh Auction

A live, multiplayer IPL Mega Auction you play with friends in the browser. One person creates a room, shares the link, and everyone bids from their own phone or laptop. Nobody needs an account.

- 264 players across 11 sets: Marquee, Capped and Uncapped
- ₹100 / 120 / 150 Cr purses, 18 to 25 squad size, max 8 overseas
- Official bid slabs, an 8-second anti-snipe reset, and a purse lock so every team can still fill 18 slots
- Retentions (18/14/11/18/14 Cr, ₹4 Cr uncapped) and RTM cards with the "final raise" twist
- AI bot franchises, spectators, host controls (pause, undo, force sold/unsold, skip and jump sets, quick-sim, kick, hand over host)
- Accelerated round with nominations, plus an unsold re-entry round at half base price
- Chat, taunts, emoji reactions, sound effects, shortlist and private notes, Playing XI builder
- Final summary with awards, team strength ratings, Top 10, Unsold XI, a 5-minute trade window, and CSV, JSON and image export

The site is already built: `index.html` + `assets/` + `firebase-config.js`. GitHub Pages can host it as it is, with no build step.

---

## 1. Put it on GitHub Pages (free)

1. Create a new repository on GitHub, for example `walleh-auction` (public).
2. Click **Add file → Upload files** and drag in **everything inside this folder**: `index.html`, `firebase-config.js`, the `assets` folder, `src`, `build.mjs`, `package.json`, `database.rules.json` and this README. Commit.
3. Open **Settings → Pages**. Under *Build and deployment*, set **Source: Deploy from a branch**, then **Branch: main** and folder **/ (root)**. Save.
4. After about a minute your site is live at `https://YOUR-USERNAME.github.io/walleh-auction/`.

## 2. Firebase (already connected)

`firebase-config.js` already points at the Firebase project **walleh-auction** (free Spark plan, Realtime Database in Singapore, anonymous sign-in on, rules from `database.rules.json` published). Nothing to do here.

To move to a different Firebase project later, follow these steps. If the keys say `PASTE_...`, the site runs in **demo mode**, where rooms only work between tabs of one browser.

1. Go to <https://console.firebase.google.com> → **Create a project** (Google Analytics is not needed).
2. **Build → Authentication → Get started → Sign-in method → Anonymous → Enable → Save.**
3. **Build → Realtime Database → Create database.** Pick a location near you (for India, `asia-southeast1` Singapore) and choose **Start in locked mode**.
4. In the database's **Rules** tab, replace everything with the contents of `database.rules.json` and click **Publish**.
5. **Project settings (gear icon) → General → Your apps → Web (`</>`)**. Register an app called `walleh` (no hosting needed) and copy the `firebaseConfig` values.
6. On GitHub, open `firebase-config.js`, click the pencil icon, paste your values over the `PASTE_...` placeholders and commit. Make sure `databaseURL` matches the URL shown at the top of your Realtime Database page.

Web API keys are safe to commit. They identify your project, and the database rules control who can read and write.

**Free plan limits:** 100 simultaneous connections and 1 GB of stored data, which is plenty for groups of friends. The app keeps traffic low: the timer is computed on each device rather than written every second, and chat and the feed only load their latest messages.

## 3. Play

1. Open the site, enter your name and **Create auction room**.
2. Press **Copy link** or **Share** and send it on WhatsApp. Friends tap it, type a name and pick a franchise.
3. As host, choose the settings and press **Start the auction**. Keep your tab open: the host's browser runs the clock and the bots. If the host drops out, anyone can press **Take over host**.

Keyboard: `Space` bids, `M` mutes.

## Editing players

Players live in `src/data/playersData.js`, one row each. After editing, rebuild:

```bash
npm install
npm run build
```

This regenerates `assets/app.js` and `assets/app.css`. Commit those two files.

## Project layout

```
index.html              page shell
firebase-config.js      your Firebase keys (edit without rebuilding)
assets/                 built app (generated)
src/
  main.jsx, App.jsx     entry and routing
  lib/db.js             Firebase layer with a local demo fallback
  lib/engine.js         auction rules: bids, timer, RTM, bots, host actions, trades
  lib/rules.js          teams, slabs, squad limits, ratings
  lib/sound.js          synthesised sound effects
  data/playersData.js   264 players
  components/           Home, Lobby, Retention, Auction, Stage, Panels, Summary…
database.rules.json     paste into Firebase → Realtime Database → Rules
```
