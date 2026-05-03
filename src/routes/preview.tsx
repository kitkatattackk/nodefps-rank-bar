import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/preview")({
  component: Preview,
});

const BG = "#181510";
const BG2 = "#201c14";
const GOLD = "#c9a84c";
const DIM = "#6b5f3e";

const STYLES = [
  {
    label: "FULL",
    param: "style=full",
    size: "540 × 80px",
    desc: "Full HUD bar — ZB tag, icon, rank, progress, K/D",
    iframeW: 580,
    iframeH: 110,
    dummy: "rank=Unreal&pct=67&kd=14.70&bg=0",
  },
  {
    label: "COMPACT",
    param: "style=compact",
    size: "340 × 36px",
    desc: "Single-line — icon, rank, mini bar, K/D",
    iframeW: 580,
    iframeH: 80,
    dummy: "rank=Diamond+3&pct=41&kd=3.85&bg=0",
  },
  {
    label: "MICRO",
    param: "style=micro",
    size: "220 × 30px",
    desc: "Pill — icon, rank name, K/D only",
    iframeW: 580,
    iframeH: 70,
    dummy: "rank=Gold+2&pct=78&kd=1.42&bg=0",
  },
];

function Preview() {
  useEffect(() => {
    document.documentElement.style.background = BG;
    document.body.style.background = BG;
    return () => {
      document.documentElement.style.background = "";
      document.body.style.background = "";
    };
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${BG2} 0%, ${BG} 60%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        padding: "48px 40px",
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 48, textAlign: "center" }}>
        <div style={{ color: GOLD, fontSize: 13, letterSpacing: "0.25em" }}>
          RANK OVERLAY
        </div>
        <div style={{ color: DIM, fontSize: 7, letterSpacing: "0.2em", marginTop: 10 }}>
          FOR OBS · MELD · STREAMLABS
        </div>
      </div>

      {/* Style rows */}
      {STYLES.map(({ label, param, size, desc, iframeW, iframeH, dummy }, i) => (
        <div key={label} style={{ width: "100%", maxWidth: 640 }}>
          {/* Divider */}
          {i > 0 && (
            <div style={{
              height: 1,
              background: `linear-gradient(90deg, transparent, ${DIM}44, transparent)`,
              margin: "32px 0",
            }} />
          )}

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            {/* Label + desc */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, alignSelf: "flex-start", paddingLeft: 4 }}>
              <span style={{ color: GOLD, fontSize: 9, letterSpacing: "0.2em" }}>
                {label}
              </span>
              <span style={{ color: DIM, fontSize: 7 }}>{desc}</span>
            </div>

            {/* Widget */}
            <iframe
              src={`/?${dummy}&${param}`}
              scrolling="no"
              allowTransparency={true}
              style={{
                border: "none",
                background: "transparent",
                display: "block",
                width: iframeW,
                height: iframeH,
              }}
            />

            {/* OBS hint */}
            <div style={{ alignSelf: "flex-end", paddingRight: 4 }}>
              <span style={{
                color: DIM,
                fontSize: 6,
                letterSpacing: "0.15em",
                background: `${BG2}cc`,
                padding: "3px 8px",
                border: `1px solid ${DIM}44`,
              }}>
                OBS: {size}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div style={{ color: DIM, fontSize: 6, letterSpacing: "0.15em", marginTop: 48, opacity: 0.6 }}>
        ADD ?bg=0 TO URL FOR TRANSPARENT BACKGROUND
      </div>
    </main>
  );
}
