import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/setup")({
  component: Setup,
});

const BG = "#181510";
const BG2 = "#201c14";
const BG3 = "#252015";
const GOLD = "#c9a84c";
const DIM = "#6b5f3e";
const TEXT = "#e8dfc4";
const FRAME = "#2e2a1f";
const GREEN = "#4caf6e";

function useQueryParam(key: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  return new URLSearchParams(window.location.search).get(key) || fallback;
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
        <div
          style={{
            flex: 1,
            background: FRAME,
            border: `1px solid ${DIM}55`,
            borderRight: "none",
            color: TEXT,
            fontSize: 6,
            padding: "8px 10px",
            letterSpacing: "0.05em",
            wordBreak: "break-all",
            lineHeight: 1.8,
          }}
        >
          {value}
        </div>
        <button
          onClick={copy}
          style={{
            background: copied ? "#1e3a1e" : GOLD,
            border: `1px solid ${copied ? GREEN : GOLD}`,
            color: copied ? GREEN : BG,
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 6,
            padding: "0 14px",
            cursor: "pointer",
            letterSpacing: "0.1em",
            whiteSpace: "nowrap",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
        >
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{ width: "100%", maxWidth: 640, display: "flex", flexDirection: "column", gap: 18 }}
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

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      <div
        style={{
          width: 30,
          height: 30,
          flexShrink: 0,
          background: `${GOLD}22`,
          border: `1px solid ${GOLD}55`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: GOLD,
          fontSize: 7,
          letterSpacing: "0.1em",
        }}
      >
        {n}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: GOLD, fontSize: 7, letterSpacing: "0.15em", marginBottom: 8 }}>
          {title}
        </div>
        <div style={{ color: DIM, fontSize: 6, letterSpacing: "0.08em", lineHeight: 2 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function PlatformCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div
      style={{
        background: BG3,
        border: `1px solid ${DIM}33`,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ color: TEXT, fontSize: 7, letterSpacing: "0.14em" }}>{title}</div>
      {lines.map((line) => (
        <div
          key={line}
          style={{ color: DIM, fontSize: 5, letterSpacing: "0.06em", lineHeight: 1.9 }}
        >
          {line}
        </div>
      ))}
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

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "https://nodefps-rank-bar.vercel.app";
  const configUrl = `${baseUrl}/config`;

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
        gap: 40,
      }}
    >
      <header style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ color: DIM, fontSize: 6, letterSpacing: "0.3em" }}>
          RANK OVERLAY SETUP GUIDE
        </div>
        <div style={{ color: GOLD, fontSize: 15, letterSpacing: "0.2em", marginTop: 4 }}>
          WELCOME{customerName ? "," : ""}
        </div>
        {customerName && (
          <div style={{ color: TEXT, fontSize: 12, letterSpacing: "0.2em" }}>
            {displayName.toUpperCase()}
          </div>
        )}
        <div style={{ color: DIM, fontSize: 6, letterSpacing: "0.15em", lineHeight: 2 }}>
          Follow this page once. After that, updating your rank takes about 30 seconds.
        </div>
      </header>

      <section
        style={{
          width: "100%",
          maxWidth: 640,
          background: `${GOLD}0e`,
          border: `2px solid ${GOLD}55`,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div style={{ color: GOLD, fontSize: 7, letterSpacing: "0.2em" }}>YOUR CONFIG PAGE</div>
        <div style={{ color: DIM, fontSize: 6, letterSpacing: "0.08em", lineHeight: 2 }}>
          Build your browser-source URL here. Bookmark it so you can update rank, progress, and K/D
          whenever your stats change.
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
          OPEN CONFIG PAGE
        </a>
      </section>

      <Section title="QUICK SETUP">
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <Step n="01" title="OPEN CONFIG">
            Open the config page above. Pick your rank, progress, K/D, mode, and widget style.
          </Step>
          <Step n="02" title="COPY OVERLAY URL">
            Press COPY on the config page. The generated URL includes transparent background and
            auto scaling for OBS, Streamlabs, and Meld.
          </Step>
          <Step n="03" title="ADD BROWSER SOURCE">
            Add a browser source/layer in your streaming app, paste the copied URL, and set the
            browser size using the platform notes below.
          </Step>
          <Step n="04" title="PLACE ON SCENE">
            Resize and position the layer on your scene. The overlay is designed to stay crisp when
            Meld uses a 1920 x 1080 browser source.
          </Step>
        </div>
      </Section>

      <Section title="SOURCE SETTINGS">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 10,
          }}
        >
          <PlatformCard
            title="MELD"
            lines={[
              "Add Layer -> Browser.",
              "Paste the generated URL.",
              "Keep browser size at 1920 x 1080.",
              "Resize the layer in the canvas.",
            ]}
          />
          <PlatformCard
            title="OBS STUDIO"
            lines={[
              "Sources -> + -> Browser.",
              "Paste the generated URL.",
              "Use 1920 x 1080 for auto scale.",
              "Or use exact style sizes below.",
            ]}
          />
          <PlatformCard
            title="STREAMLABS"
            lines={[
              "Sources -> + -> Browser Source.",
              "Paste the generated URL.",
              "Use 1920 x 1080 for auto scale.",
              "Transform/resize on the scene.",
            ]}
          />
        </div>
      </Section>

      <Section title="STYLE SIZES">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            ["FULL", "540 x 80px", "Best for a dedicated rank bar below a webcam or game HUD."],
            ["COMPACT", "340 x 36px", "Slim corner placement with icon, rank, progress, and K/D."],
            ["MICRO", "220 x 30px", "Tiny pill for minimal scenes or stacked stream widgets."],
          ].map(([style, size, desc]) => (
            <div
              key={style}
              style={{
                background: BG3,
                border: `1px solid ${DIM}33`,
                padding: "9px 10px",
                display: "grid",
                gridTemplateColumns: "90px 100px 1fr",
                gap: 10,
                alignItems: "start",
              }}
            >
              <span style={{ color: GOLD, fontSize: 6, letterSpacing: "0.12em" }}>{style}</span>
              <span style={{ color: TEXT, fontSize: 5, letterSpacing: "0.08em" }}>{size}</span>
              <span style={{ color: DIM, fontSize: 5, lineHeight: 1.9 }}>{desc}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="TROUBLESHOOTING">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            ["IT LOOKS TINY", "Copy a fresh URL from config. It should include scale=auto."],
            ["IT LOOKS BLURRY", "Use browser size 1920 x 1080, then resize the scene layer."],
            ["BACKGROUND IS VISIBLE", "Make sure the copied URL includes bg=0."],
            [
              "RANK CHANGED",
              "Open config, update stats, copy the new URL, replace the browser URL.",
            ],
            ["STILL STUCK", "Send a screenshot of your source settings with your Etsy message."],
          ].map(([title, desc]) => (
            <div key={title} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: GOLD, fontSize: 6, flexShrink: 0, marginTop: 1 }}>-</span>
              <div>
                <span style={{ color: TEXT, fontSize: 6, letterSpacing: "0.1em" }}>{title} </span>
                <span style={{ color: DIM, fontSize: 6, letterSpacing: "0.06em", lineHeight: 2 }}>
                  - {desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <footer style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 12 }}>
        <a
          href={configUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            color: GOLD,
            fontSize: 7,
            letterSpacing: "0.2em",
            textDecoration: "none",
            border: `1px solid ${GOLD}55`,
            padding: "8px 20px",
            background: `${GOLD}12`,
          }}
        >
          OPEN CONFIG PAGE
        </a>
        <div style={{ color: DIM, fontSize: 5, letterSpacing: "0.12em", opacity: 0.6 }}>
          RANK OVERLAY - MADE FOR STREAMERS
        </div>
      </footer>
    </main>
  );
}
