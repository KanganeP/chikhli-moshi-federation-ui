# Chikhli–Moshi Federation website

React 18 + Material UI 6 + Vite. 15 routes, 3D-styled UI (CSS 3D city scene, tilt/flip cards, extruded buttons), fully responsive, Google AdSense slots on every content page.

## Run
```
npm install
cp .env.example .env     # fill in later
npm run dev              # http://localhost:5173
npm run build            # output in dist/
```

## Google ads
1. Get AdSense approved for your domain; put the `ca-pub-…` ID in `VITE_ADSENSE_CLIENT`.
2. Create 4 responsive display units and paste their slot IDs (`VITE_AD_SLOT_*`). The leaderboard slot is also reused for the mobile sticky ad.
3. Put your line in `public/ads.txt`.
4. Until then, labelled "Google ad space" boxes show in dev. For production preview set `VITE_SHOW_AD_PLACEHOLDERS=true`; leave it false for a clean live site.

Placements (`src/components/AdSlot.jsx`): leaderboard (top of each page + home), rectangle (bottom/in-content), sidebar 300x600 (sticky, desktop), in-feed (between list items on Societies/Notices/Events/etc.), mobile anchor (dismissible, hidden on form pages and 404). Space is reserved to avoid layout shift. 404 and form-heavy pages carry no/few ads per AdSense policy.

## Content to replace
All names, phones, fees, dates and stats are placeholders: `src/data/content.js`, `src/config/site.js`. Add real files to `public/docs` and photos to `public/gallery` (set `src` on gallery items). Forms post JSON to `VITE_FORM_ENDPOINT` (e.g. Formspree); without it they run in demo mode. Privacy/Terms are templates — have them reviewed.

## Hosting
SPA fallback included for Netlify (`public/_redirects`) and Vercel (`vercel.json`).

## Admin dashboard (new)

```
cp .env.example .env      # set ADMIN_PASSWORD and ADMIN_SECRET (long random text)
npm install
npm run dev:all           # site on http://localhost:5173 , API on :4000 , admin at /admin
```
Production: `npm start` builds the site and serves it together with the API and admin on one port (default 4000).

What the admin manages (all stored in `server/data/db.json`, uploads in `server/uploads`):
- **Societies, Committee, Gallery**: add, edit, delete, activate/deactivate. Inactive records disappear from the website.
- **Notices and Events**: set status (Published/Draft) and a *Publish at* date and time. They show on the website only when published, active and the time has arrived.
- **Issues**: submitted from the Raise an Issue page. Mark read, in progress or fixed; reopen; archive with the Active switch; add an internal note.
- **Membership**: website applications arrive as Pending. Approve (sets start date and 1-year expiry), reject, renew, track payment, export CSV.
- Counts (total / active / inactive) on every page and on the dashboard.

Notes
- The first run seeds the database with the sample content from `src/data/content.js` plus a few sample issues and members. Delete them in the admin.
- If the API is not running, the public site falls back to the static sample content.
- Back up `server/data` and `server/uploads`. For many editors or heavy traffic, move the store to a real database (Postgres, MongoDB, Supabase); the REST shape in `server/index.js` is the only thing to replace.
- Put the site behind HTTPS and keep `ADMIN_PASSWORD` private. There is a single shared admin password; add per-user accounts if several people need separate logins.
