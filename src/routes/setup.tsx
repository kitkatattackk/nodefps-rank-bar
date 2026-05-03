import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/setup")({
  component: Setup,
});

const BG   = "#181510";
const BG2  = "#201c14";
const BG3  = "#252015";
const GOLD = "#c9a84c";
const DIM  = "#6b5f3e";
const TEXT = "#e8dfc4";
const FRAME = "#2e2a1f";
const GREEN = "#4caf6e";

function useQueryParam(key: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  return new URLSearchParams(window.location.search).get(key) || fallback;
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      <div style={{
        width: 28, height: 28, flexShrink: 0,
        background: `${GOLD}22`, border: `1px solid ${GOLD}55`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: GOLD, fontSize: 7, letterSpacing: "0.1em",
      }}>
        {n}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: GOLD, fontSize: 7, letterSpacing: "0.15em", marginBottom: 8 }}>{title}</div>
        <div style={{ color: DIM, fontSize: 6, letterSpacing: "0.08em", lineHeight: 2 }}>{children}</div>
      </div>
    </div>
  );
}

function CopyBox({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ color: DIM, fontSize: 5, letterSpacing: "0.2em" }}>{label}</div>
      <div style={{ display: "flex", gap: 0 }}>
        <div style={{
          flex: 1,
          background: FRAME,
          border: `1px solid ${DIM}55`,
          borderRight: "none",
          color: TEXT,
          fontSize: 6,
          padding: "8px 10px",
          letterSpacing: "0.05em",
          wordBreak: "break-all" as const,
          lineHeight: 1.8,
        }}>
          {value}
        </div>
        <button onClick={copy} style={{
          background: copied ? "#1e3a1e" : GOLD,
          border: `1px solid ${copied ? GREEN : GOLD}`,
          color: copied ? GREEN : BG,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 6,
          padding: "0 14px",
          cursor: "pointer",
          letterSpacing: "0.1em",
          whiteSpace: "nowrap" as const,
          transition: "all 0.2s",
          flexShrink: 0,
        }}>
          {copied ? "✓ COPIED" : "COPY"}
        </button>
      </div>
    </div>
  );
}

export default function Setup() {
  const customerName = useQueryParam("for", "");
  const displayName = customerName || "Streamer";

  useEffect(() => {
    document.documentElement.style.background = BG;
    document.body.style.background = BG;
    return () => {
      document.documentElement.style.background = "";
      document.body.style.background = "";
    };
  }, []);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://nodefps-rank-bar.vercel.app";
  const configUrl = `${baseUrl}/config`;

  return (
    <main style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${BG2} 0%, ${BG} 55%)`,
      fontFamily: "'Press Start 2P', monospace",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "48px 20px 72px",
      gap: 40,
    }}>

      {/* ── HEADER ── */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ color: DIM, fontSize: 6, letterSpacing: "0.3em" }}>RANK OVERLAY · SETUP GUIDE</div>
        <div style={{ color: GOLD, fontSize: 15, letterSpacing: "0.2em", marginTop: 4 }}>
          WELCOME{customerName ? `,` : ""}
        </div>
        {customerName && (
          <div style={{ color: TEXT, fontSize: 12, letterSpacing: "0.2em" }}>
            {displayName.toUpperCase()}
          </div>
        )}
        <div style={{ color: DIM, fontSize: 6, letterSpacing: "0.15em", marginTop: 6, lineHeight: 2 }}>
          Follow the steps below to get your overlay live in under 5 minutes.
        </div>
      </div>

      {/* ── CONFIG LINK CALLOUT ── */}
      <div style={{
        width: "100%",
        maxWidth: 560,
        background: `${GOLD}0e`,
        border: `2px solid ${GOLD}55`,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}>
        <div style={{ color: GOLD, fontSize: 7, letterSpacing: "0.2em" }}>YOUR CONFIG PAGE</div>
        <div style={{ color: DIM, fontSize: 6, letterSpacing: "0.08em", lineHeight: 2 }}>
          This is where you set your rank and generate your personal OBS URL.
          Bookmark it — you'll come back whenever your rank changes.
        </div>
        <CopyBox label="OPEN THIS LINK" value={configUrl} />
        <a
          href={configUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "block",
            textAlign: "center",
            background: GOLD,
            color: BG,
            fontSize: 7,
            letterSpacing: "0.2em",
            padding: "10px 0",
            textDecoration: "none",
          }}
        >
          OPEN CONFIG PAGE →
        </a>
      </div>

      {/* ── STEPS ── */}
      <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 0 }}>
        <div style={{ color: DIM, fontSize: 6, letterSpacing: "0.25em", borderBottom: `1px solid ${DIM}33`, paddingBottom: 6, marginBottom: 24 }}>
          SETUP STEPS
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

          <Step n="01" title="OPEN THE CONFIG PAGE">
            Click the link above or copy it into your browser.
            You'll see a form where you can set up your overlay.
          </Step>

          <div style={{ height: 1, background: `${DIM}22` }} />

          <Step n="02" title="SET YOUR CURRENT STATS">
            Fill in your rank (e.g. Diamond 3), progress % toward the next rank,
            and your current K/D. Then pick ZB or BR and choose a widget style:
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
              {[
                { s: "FULL",    size: "540 × 80px",  desc: "Best for a dedicated rank bar below your cam" },
                { s: "COMPACT", size: "340 × 36px",  desc: "Slim bar — good for corner placement" },
                { s: "MICRO",   size: "220 × 30px",  desc: "Tiny pill — sits anywhere without taking space" },
              ].map(({ s, size, desc }) => (
                <div key={s} style={{
                  background: BG3,
                  border: `1px solid ${DIM}33`,
                  padding: "8px 10px",
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}>
                  <span style={{ color: GOLD, fontSize: 6, flexShrink: 0, letterSpacing: "0.12em" }}>{s}</span>
                  <span style={{ color: DIM, fontSize: 5, lineHeight: 1.9 }}>
                    {size} — {desc}
                  </span>
                </div>
              ))}
            </div>
          </Step>

          <div style={{ height: 1, background: `${DIM}22` }} />

          <Step n="03" title="COPY YOUR OBS URL">
            At the bottom of the config page, hit <span style={{ color: GOLD }}>COPY</span>.
            Your personal overlay URL is now in your clipboard.
          </Step>

          <div style={{ height: 1, background: `${DIM}22` }} />

          <Step n="04" title="ADD TO OBS / STREAMLABS / MELD">
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 2 }}>
              <div>
                <span style={{ color: TEXT }}>OBS Studio</span>
                {" — Sources → + → Browser Source → paste URL → set width/height"}
              </div>
              <div>
                <span style={{ color: TEXT }}>Streamlabs</span>
                {" — Sources → + → Browser Source → paste URL → set width/height"}
              </div>
              <div>
                <span style={{ color: TEXT }}>Meld</span>
                {" — Add Layer → Browser → paste URL → resize to fit"}
              </div>
            </div>
          </Step>

          <div style={{ height: 1, background: `${DIM}22` }} />

          <Step n="05" title="UPDATING YOUR RANK">
            When your rank changes — go back to the config page, update your stats,
            copy the new URL, and paste it into your browser source. Takes about 30 seconds.
            <div style={{ marginTop: 8, color: `${GOLD}aa`, fontSize: 5, lineHeight: 2 }}>
              ↳ Auto-refresh (no manual updates) is coming soon via the Tracker.gg API.
            </div>
          </Step>

        </div>
      </div>

      {/* ── TIPS ── */}
      <div style={{
        width: "100%",
        maxWidth: 560,
        background: BG3,
        border: `1px solid ${DIM}33`,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}>
        <div style={{ color: DIM, fontSize: 6, letterSpacing: "0.25em" }}>TIPS</div>
        {[
          ["TRANSPARENT BG", "Add &bg=0 to your URL (or toggle in config) to remove the beige background"],
          ["WRONG SIZE?",     "Make sure your OBS browser source dimensions match the style you picked"],
          ["RANK UPDATED?",   "Just open config, tweak your stats, copy the new URL, replace it in OBS"],
          ["NEED HELP?",      "Message me on Etsy — I usually reply within a few hours"],
        ].map(([title, desc]) => (
          <div key={title} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ color: GOLD, fontSize: 6, flexShrink: 0, marginTop: 1 }}>◆</span>
            <div>
              <span style={{ color: TEXT, fontSize: 6, letterSpacing: "0.1em" }}>{title} </span>
              <span style={{ color: DIM, fontSize: 6, letterSpacing: "0.06em", lineHeight: 2 }}>— {desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        <a href={configUrl} target="_blank" rel="noreferrer" style={{
          color: GOLD, fontSize: 7, letterSpacing: "0.2em", textDecoration: "none",
          border: `1px solid ${GOLD}55`, padding: "8px 20px", background: `${GOLD}12`,
        }}>
          OPEN CONFIG PAGE →
        </a>
        <div style={{ color: DIM, fontSize: 5, letterSpacing: "0.12em", opacity: 0.6 }}>
          RANK OVERLAY · MADE WITH ♥ FOR STREAMERS
        </div>
      </div>

    </main>
  );
}
