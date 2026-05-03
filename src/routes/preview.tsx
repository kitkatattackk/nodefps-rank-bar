import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/preview")({
  component: Preview,
});

const STYLES = [
  {
    label: "FULL",
    param: "style=full",
    size: "540 × 80px",
    desc: "Full HUD bar — ZB tag, icon, rank, progress, K/D",
    iframeW: 600,
    iframeH: 110,
  },
  {
    label: "COMPACT",
    param: "style=compact",
    size: "340 × 36px",
    desc: "Single-line — icon, rank, mini bar, K/D",
    iframeW: 600,
    iframeH: 80,
  },
  {
    label: "MICRO",
    param: "style=micro",
    size: "220 × 30px",
    desc: "Pill — icon, rank, K/D only",
    iframeW: 600,
    iframeH: 70,
  },
];

const DUMMY = "name=nodefps&rank=Elite+1&pct=13&bg=0";

function Preview() {
  useEffect(() => {
    document.documentElement.style.background = "#1a1a2e";
    document.body.style.background = "#1a1a2e";
    return () => {
      document.documentElement.style.background = "";
      document.body.style.background = "";
    };
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#1a1a2e",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
        padding: 40,
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      <div style={{ color: "#fff", fontSize: 11, letterSpacing: "0.2em", opacity: 0.5 }}>
        NODEFPS RANK OVERLAY — STYLE PREVIEW
      </div>

      {STYLES.map(({ label, param, size, desc, iframeW, iframeH }) => (
        <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>

          {/* Label row */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ color: "#fff", fontSize: 10, letterSpacing: "0.2em" }}>{label}</span>
            <span style={{ color: "#ffffff44", fontSize: 7 }}>— {desc}</span>
          </div>

          {/* Widget iframe — transparent so only the widget is visible */}
          <iframe
            src={`/?${DUMMY}&${param}`}
            scrolling="no"
            allowTransparency={true}
            style={{
              border: "none",
              background: "transparent",
              display: "block",
              width: iframeW,
              height: iframeH,
              overflow: "hidden",
            }}
          />

          {/* OBS size hint */}
          <span style={{ color: "#ffffff33", fontSize: 7, letterSpacing: "0.15em" }}>
            OBS BROWSER SOURCE: {size}
          </span>
        </div>
      ))}

      <div style={{ color: "#ffffff22", fontSize: 7, letterSpacing: "0.15em", marginTop: 8 }}>
        ADD ?bg=0 TO YOUR URL FOR TRANSPARENT BACKGROUND IN OBS
      </div>
    </main>
  );
}
