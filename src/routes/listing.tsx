import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/listing")({
  component: Listing,
});

const BG = "#181510";
const BG2 = "#201c14";
const BG3 = "#252015";
const GOLD = "#c9a84c";
const DIM = "#6b5f3e";
const TEXT = "#e8dfc4";
const FRAME = "#2e2a1f";
const GREEN = "#4caf6e";

function CopyBlock({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ color: GOLD, fontSize: 6, letterSpacing: "0.18em" }}>{label}</div>
      <div
        style={{
          background: FRAME,
          border: `1px solid ${DIM}44`,
          color: TEXT,
          fontFamily: "monospace",
          fontSize: 12,
          lineHeight: 1.7,
          padding: 14,
          whiteSpace: "pre-wrap",
        }}
      >
        {value}
      </div>
      <button
        onClick={copy}
        style={{
          alignSelf: "flex-start",
          background: copied ? "#1e3a1e" : GOLD,
          border: `1px solid ${copied ? GREEN : GOLD}`,
          color: copied ? GREEN : BG,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 6,
          padding: "8px 14px",
          cursor: "pointer",
          letterSpacing: "0.12em",
        }}
      >
        {copied ? "COPIED" : "COPY"}
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        width: "100%",
        maxWidth: 760,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div
        style={{
          color: DIM,
          fontSize: 6,
          letterSpacing: "0.25em",
          borderBottom: `1px solid ${DIM}33`,
          paddingBottom: 6,
        }}
      >
        {title}
      </div>
      {children}
    </section>
  );
}

const LISTING_TITLE =
  "Fortnite Rank Overlay for OBS, Meld and Streamlabs - Custom Browser Source Widget";

const LISTING_DESCRIPTION = `Add a clean rank/KD overlay to your stream with a browser source link you can update anytime.

What you get:
- Config page to set rank, progress, K/D, mode, and widget style
- 3 widget layouts: full bar, compact bar, and micro pill
- Transparent background for OBS, Meld, and Streamlabs
- Auto-scaling URL for large browser sources, including Meld 1920 x 1080
- Buyer setup guide with troubleshooting notes

Automation note:
This version is designed for quick manual updates through the config page. Automated stat syncing may be available as a future/custom upgrade depending on API access and the buyer's account/game setup. If you want automatic rank/KD updates instead of manual changes, message me before ordering and I can confirm what is possible.

How it works:
1. Open your setup link.
2. Build your overlay URL in the config page.
3. Paste the URL into a browser source.
4. Resize and place it on your stream scene.

This is a digital stream overlay/browser source. No physical item is shipped.`;

const FULFILLMENT_MESSAGE = `Thanks for your order.

Here is your setup guide:
{{SETUP_LINK}}

Open that page first. It has the config page link, recommended OBS/Meld/Streamlabs settings, style sizes, and troubleshooting notes.

This order uses manual updates through the config page. If you want automated stat syncing later, message me and I can check whether it is possible for your account/setup.

Quick Meld note: paste the generated URL into a Browser layer, keep browser size at 1920 x 1080, then resize the layer on your scene.`;

const DEMO_SHOT_LIST = `Record a 20-30 second listing demo:

1. Start on /setup and show the "Open Config Page" button.
2. Open /config and change rank, K/D, mode, and style.
3. Click copy on the OBS browser source URL.
4. Show the browser source result on a black canvas at 1920 x 1080.
5. Resize the layer to show it stays crisp.

Caption idea:
"Paste into OBS, Meld, or Streamlabs as a browser source. Includes transparent background, auto scaling, and optional automation possibilities for future/custom setups."`;

export default function Listing() {
  useEffect(() => {
    document.documentElement.style.background = BG;
    document.body.style.background = BG;
    return () => {
      document.documentElement.style.background = "";
      document.body.style.background = "";
    };
  }, []);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://rankforge-stream-overlay.vercel.app";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${BG2} 0%, ${BG} 55%)`,
        fontFamily: "'Press Start 2P', monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 20px 72px",
        gap: 34,
      }}
    >
      <header
        style={{ width: "100%", maxWidth: 760, display: "flex", flexDirection: "column", gap: 12 }}
      >
        <div style={{ color: DIM, fontSize: 6, letterSpacing: "0.3em" }}>SELLER KIT</div>
        <div style={{ color: GOLD, fontSize: 14, letterSpacing: "0.18em", lineHeight: 1.6 }}>
          ETSY LISTING PACKAGE
        </div>
        <div style={{ color: DIM, fontSize: 6, letterSpacing: "0.12em", lineHeight: 2 }}>
          Use this page to list, deliver, and support the overlay without rewriting the same
          answers.
        </div>
      </header>

      <Section title="DELIVERY LINKS">
        <div
          style={{
            background: BG3,
            border: `1px solid ${DIM}33`,
            padding: 16,
            display: "grid",
            gap: 10,
          }}
        >
          <div style={{ color: TEXT, fontSize: 7, letterSpacing: "0.12em" }}>
            Setup guide: {baseUrl}/setup?for=CustomerName
          </div>
          <div style={{ color: TEXT, fontSize: 7, letterSpacing: "0.12em" }}>
            Config page: {baseUrl}/config
          </div>
          <div style={{ color: DIM, fontSize: 5, letterSpacing: "0.07em", lineHeight: 1.9 }}>
            In Etsy messages, replace CustomerName with the buyer's name or shop handle.
          </div>
        </div>
      </Section>

      <Section title="LISTING COPY">
        <CopyBlock label="TITLE" value={LISTING_TITLE} />
        <CopyBlock label="DESCRIPTION" value={LISTING_DESCRIPTION} />
      </Section>

      <Section title="FULFILLMENT">
        <CopyBlock label="BUYER MESSAGE" value={FULFILLMENT_MESSAGE} />
      </Section>

      <Section title="AUTOMATION POSITIONING">
        <CopyBlock
          label="SAVED REPLY"
          value={`Right now the overlay is manual-update: open the config page, change rank/K/D, copy the new URL, and paste it into your browser source.

Automation may be possible as a custom upgrade if the stats API/account setup supports it. If you want that, send your platform/account details first and I can confirm before quoting or promising it.`}
        />
      </Section>

      <Section title="DEMO VIDEO">
        <CopyBlock label="SHOT LIST" value={DEMO_SHOT_LIST} />
      </Section>
    </main>
  );
}
