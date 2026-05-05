# Fortnite Rank Overlay

A real-time Fortnite ranked stats overlay for OBS, Meld, and Streamlabs — built as a browser source widget with a pixel-art HUD aesthetic.

**Live demo & overview → `/overview`**  
**Config builder → `/config`**  
**Buyer setup guide → `/setup`**  
**Seller listing kit → `/listing`**

---

## What It Does

Displays your current Fortnite rank, promotion progress, and K/D ratio directly on your stream. Three widget styles let you pick the right size for your layout. All styles support transparent backgrounds and drop straight onto any scene.

| Style | OBS Size | Contents |
|-------|----------|----------|
| **Full** | 540 × 80px | ZB/BR tag · rank icon · rank name · progress bar · K/D |
| **Compact** | 340 × 36px | Rank icon · rank name · mini progress bar · K/D |
| **Micro** | 220 × 30px | Rank icon · rank name · K/D pill |

---

## Pages

| URL | Purpose |
|-----|---------|
| `/overview` | Product overview — all styles, features, how it works |
| `/preview` | Side-by-side preview of all 3 widget styles |
| `/config` | Interactive config builder — generates your OBS URL |
| `/setup` | Buyer-facing setup guide with source settings and troubleshooting |
| `/listing` | Seller-facing Etsy copy, fulfillment message, and demo shot list |
| `/` | The widget itself (used as your OBS browser source URL) |

---

## Quick Start

1. Go to **`/config`** on your deployed URL
2. Choose your rank, progress %, K/D, mode (ZB/BR), and style
3. Hit **COPY** — your browser source URL is ready
4. In OBS: **Add Source → Browser Source → paste URL**
5. Use browser size **1920 × 1080** for auto-scale, or exact style sizes if preferred
6. Update manually through `/config`, or quote automation separately if API/account access supports it

For Meld, keep the browser layer size at **1920 × 1080** and resize the layer on the canvas.

---

## URL Parameters

The widget is controlled entirely via URL params — no login, no account needed.

| Param | Values | Description |
|-------|--------|-------------|
| `rank` | e.g. `Unreal`, `Diamond+3`, `Gold+1` | Rank name (overrides API) |
| `pct` | `0`–`100` | Promotion progress % |
| `kd` | e.g. `3.85` | K/D ratio |
| `mode` | `zb` / `br` | Zero Build or Battle Royale |
| `style` | `full` / `compact` / `micro` | Widget style |
| `scale` | `auto` / number | Auto-scales for large browser sources; numeric values force scale |
| `bg` | `1` (default) / `0` | `0` = transparent background |
| `name` | Epic username | Player to fetch stats for (when API is live) |

**Example URL:**
```
https://your-site.vercel.app/?rank=Unreal&pct=67&kd=14.70&style=full&mode=zb&scale=auto&bg=0
```

---

## Ranks Supported

All 8 Fortnite ranked tiers, each with a unique icon, color, and glow:

`Bronze` · `Silver` · `Gold` · `Platinum` · `Diamond` · `Elite` · `Champion` · `Unreal`

Sub-divisions (1/2/3) are supported — e.g. `Diamond 3`, `Gold 1`.

---

## Features

- **Animated K/D counter** — smooth eased animation when K/D changes, color flash on update
- **Pixel-art HUD aesthetic** — Press Start 2P font, chunky progress bar, corner markers
- **Per-rank glow** — radial gradient glow behind each rank icon in the rank's accent color
- **Transparent background** — add `?bg=0` to remove the beige background for OBS overlaying
- **Meld auto-scaling** — generated URLs include `scale=auto` so large browser sources render crisp
- **ZB + BR modes** — separate ranked segments for Zero Build and Battle Royale
- **Config UI** — no-code URL builder with live preview
- **Setup + listing pages** — ready-to-send buyer guide and seller copy/fulfillment kit
- **Automation-ready positioning** — manual updates today, with optional custom automation when API/account access supports it

---

## Manual Updates And Automation

The Etsy-ready product is manual-update by default: open `/config`, adjust rank/progress/K/D, copy the new browser-source URL, and replace it in OBS, Meld, or Streamlabs.

Automation can be offered as a custom upgrade only when the target stats API and buyer account setup support it. Do not promise hands-free updates in the base listing; position it as "message me first so I can confirm what is possible."

Stats API work is staged through the [Tracker.gg API](https://tracker.gg/developers). The free tier blocks server-side requests, so the app currently serves **mock data** until TRN production API access is approved.

**To enable live stats once approved:**  
Remove the mock `return` block at the top of `api/stats.ts` and set `TRN_API_KEY` in your Vercel environment variables.

```ts
// api/stats.ts — remove these lines once approved:
return Response.json({
  error: null,
  stats: { division: "Unreal", pct: 67, kd: 14.70 },
});
```

In the meantime, use the `/config` page to manually set your current stats and update the OBS URL when your rank changes.

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | React + Vite (SPA) |
| Routing | TanStack Router |
| Styling | Tailwind CSS v4 + inline styles |
| API | Vercel Edge Function (`api/stats.ts`) |
| Deployment | Vercel |
| Font | Press Start 2P (Google Fonts) |

---

## Local Development

```bash
bun install
bun dev
```

The app runs at `http://localhost:5173`.

- Widget: `http://localhost:5173/?rank=Unreal&pct=67&kd=14.70&style=full&bg=0`
- Overview: `http://localhost:5173/overview`
- Config: `http://localhost:5173/config`
- Setup: `http://localhost:5173/setup?for=Streamer`
- Listing kit: `http://localhost:5173/listing`
- Preview: `http://localhost:5173/preview`

---

## Deployment

Deployed to Vercel. The `vercel.json` includes a SPA rewrite rule so all routes serve `index.html`, and `/api/*` routes are handled by the Edge Function.

```json
{
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

Push to `main` → Vercel auto-deploys.
