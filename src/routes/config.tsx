import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/config")({
  component: Config,
});

const BG = "#181510";
const BG2 = "#201c14";
const GOLD = "#c9a84c";
const DIM = "#6b5f3e";
const FRAME = "#2e2a1f";

const RANKS = [
  "Bronze 1",
  "Bronze 2",
  "Bronze 3",
  "Silver 1",
  "Silver 2",
  "Silver 3",
  "Gold 1",
  "Gold 2",
  "Gold 3",
  "Platinum 1",
  "Platinum 2",
  "Platinum 3",
  "Diamond 1",
  "Diamond 2",
  "Diamond 3",
  "Elite",
  "Champion",
  "Unreal",
];

const OBS_SIZES: Record<string, string> = {
  full: "540 × 80px",
  compact: "340 × 36px",
  micro: "220 × 30px",
};

const STYLE_NOTES: Record<string, string> = {
  full: "Dedicated rank bar for webcam borders or lower HUD placement.",
  compact: "Slim scene corner widget with progress and K/D.",
  micro: "Small pill for minimal stream layouts.",
};

const IFRAME_DIMS: Record<string, { w: number; h: number }> = {
  full: { w: 580, h: 110 },
  compact: { w: 420, h: 70 },
  micro: { w: 320, h: 60 },
};

function Config() {
  const [rank, setRank] = useState("Unreal");
  const [pct, setPct] = useState(67);
  const [kd, setKd] = useState("14.70");
  const [mode, setMode] = useState("zb");
  const [style, setStyle] = useState("full");
  const [copied, setCopied] = useState(false);
  const [copiedSetup, setCopiedSetup] = useState(false);
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    document.documentElement.style.background = BG;
    document.body.style.background = BG;
    return () => {
      document.documentElement.style.background = "";
      document.body.style.background = "";
    };
  }, []);

  const baseUrl = typeof window !== "undefined" ? `${window.location.origin}/` : "/";

  const params = new URLSearchParams({
    rank,
    pct: String(pct),
    kd,
    mode,
    style,
    scale: "auto",
    bg: "0",
  });

  const obsUrl = `${baseUrl}?${params.toString()}`;
  const setupUrl = `${baseUrl}setup${
    customerName.trim() ? `?for=${encodeURIComponent(customerName.trim())}` : ""
  }`;
  const { w, h } = IFRAME_DIMS[style];

  function copy() {
    navigator.clipboard.writeText(obsUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  function copySetup() {
    navigator.clipboard.writeText(setupUrl).then(() => {
      setCopiedSetup(true);
      setTimeout(() => setCopiedSetup(false), 1800);
    });
  }

  const inputStyle: React.CSSProperties = {
    background: FRAME,
    border: `2px solid ${DIM}66`,
    color: GOLD,
    fontFamily: "'Press Start 2P', monospace",
    fontSize: 9,
    padding: "6px 10px",
    outline: "none",
    width: "100%",
    appearance: "none",
  };

  const labelStyle: React.CSSProperties = {
    color: DIM,
    fontSize: 7,
    letterSpacing: "0.18em",
    marginBottom: 6,
    display: "block",
  };

  const segBtnStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "6px 0",
    background: active ? GOLD : FRAME,
    color: active ? BG : DIM,
    border: `2px solid ${active ? GOLD : DIM + "44"}`,
    fontFamily: "'Press Start 2P', monospace",
    fontSize: 8,
    cursor: "pointer",
    letterSpacing: "0.12em",
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${BG2} 0%, ${BG} 60%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 24px",
        fontFamily: "'Press Start 2P', monospace",
        gap: 40,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div style={{ color: GOLD, fontSize: 13, letterSpacing: "0.25em" }}>OVERLAY CONFIG</div>
        <div style={{ color: DIM, fontSize: 7, letterSpacing: "0.2em", marginTop: 10 }}>
          BUILD YOUR BROWSER SOURCE URL
        </div>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 560,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* Row 1: Rank + Mode */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 16,
          }}
        >
          {/* Rank */}
          <div>
            <label style={labelStyle}>RANK</label>
            <select value={rank} onChange={(e) => setRank(e.target.value)} style={inputStyle}>
              {RANKS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Mode */}
          <div>
            <label style={labelStyle}>MODE</label>
            <div style={{ display: "flex" }}>
              <button onClick={() => setMode("zb")} style={segBtnStyle(mode === "zb")}>
                ZB
              </button>
              <button onClick={() => setMode("br")} style={segBtnStyle(mode === "br")}>
                BR
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Progress + K/D */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 16,
          }}
        >
          {/* Progress */}
          <div>
            <label style={labelStyle}>PROGRESS — {pct}%</label>
            <input
              type="range"
              min={0}
              max={100}
              value={pct}
              onChange={(e) => setPct(Number(e.target.value))}
              style={{ width: "100%", accentColor: GOLD, cursor: "pointer" }}
            />
          </div>

          {/* K/D */}
          <div>
            <label style={labelStyle}>K/D RATIO</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={kd}
              onChange={(e) => setKd(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Row 3: Style */}
        <div>
          <label style={labelStyle}>STYLE</label>
          <div style={{ display: "flex" }}>
            {(["full", "compact", "micro"] as const).map((s) => (
              <button key={s} onClick={() => setStyle(s)} style={segBtnStyle(style === s)}>
                {s.toUpperCase()}
              </button>
            ))}
          </div>
          <div
            style={{
              color: DIM,
              fontSize: 5,
              letterSpacing: "0.08em",
              lineHeight: 1.8,
              marginTop: 8,
            }}
          >
            {STYLE_NOTES[style]}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${DIM}44, transparent)`,
          }}
        />

        {/* Live Preview */}
        <div>
          <label style={labelStyle}>LIVE PREVIEW</label>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 90,
              background: FRAME,
              border: `2px solid ${DIM}44`,
              padding: 16,
            }}
          >
            <iframe
              key={obsUrl}
              src={obsUrl}
              scrolling="no"
              allowTransparency={true}
              style={{
                border: "none",
                background: "transparent",
                display: "block",
                width: w,
                height: h,
                maxWidth: "100%",
              }}
            />
          </div>
          <div style={{ textAlign: "right", marginTop: 6 }}>
            <span style={{ color: DIM, fontSize: 6, letterSpacing: "0.15em" }}>
              EXACT SIZE: {OBS_SIZES[style]} / AUTO SCALE: 1920 × 1080 SOURCE
            </span>
          </div>
        </div>

        <div
          style={{
            background: `${GOLD}0e`,
            border: `1px solid ${GOLD}44`,
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ color: GOLD, fontSize: 6, letterSpacing: "0.18em" }}>
            RECOMMENDED SOURCE SETTINGS
          </div>
          <div style={{ color: DIM, fontSize: 5, letterSpacing: "0.07em", lineHeight: 1.9 }}>
            Meld, OBS, and Streamlabs: set browser size to 1920 × 1080 and resize the layer on your
            scene. The generated URL includes scale=auto so the widget does not come in tiny.
          </div>
          <div style={{ color: DIM, fontSize: 5, letterSpacing: "0.07em", lineHeight: 1.9 }}>
            Prefer exact sizing? Use {OBS_SIZES[style]} for the selected style.
          </div>
        </div>

        {/* URL output + copy */}
        <div>
          <label style={labelStyle}>OBS BROWSER SOURCE URL</label>
          <div style={{ display: "flex", gap: 8 }}>
            <div
              style={{
                flex: 1,
                background: FRAME,
                border: `2px solid ${DIM}44`,
                padding: "8px 10px",
                color: DIM,
                fontSize: 7,
                letterSpacing: "0.05em",
                wordBreak: "break-all",
                lineHeight: 1.8,
              }}
            >
              {obsUrl}
            </div>
            <button
              onClick={copy}
              style={{
                background: copied ? "#2a4a2a" : GOLD,
                border: "none",
                color: copied ? "#6fcf6f" : BG,
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 7,
                padding: "0 14px",
                cursor: "pointer",
                letterSpacing: "0.1em",
                whiteSpace: "nowrap",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {copied ? "COPIED!" : "COPY"}
            </button>
          </div>
        </div>

        <div>
          <label style={labelStyle}>BUYER SETUP LINK</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
            <input
              type="text"
              placeholder="Customer name (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={inputStyle}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <div
                style={{
                  flex: 1,
                  background: FRAME,
                  border: `2px solid ${DIM}44`,
                  padding: "8px 10px",
                  color: DIM,
                  fontSize: 7,
                  letterSpacing: "0.05em",
                  wordBreak: "break-all",
                  lineHeight: 1.8,
                }}
              >
                {setupUrl}
              </div>
              <button
                onClick={copySetup}
                style={{
                  background: copiedSetup ? "#2a4a2a" : FRAME,
                  border: `2px solid ${copiedSetup ? "#6fcf6f" : DIM + "55"}`,
                  color: copiedSetup ? "#6fcf6f" : GOLD,
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  padding: "0 14px",
                  cursor: "pointer",
                  letterSpacing: "0.1em",
                  whiteSpace: "nowrap",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                {copiedSetup ? "COPIED!" : "COPY"}
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            background: BG2,
            border: `1px solid ${DIM}33`,
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 9,
          }}
        >
          <div style={{ color: DIM, fontSize: 6, letterSpacing: "0.2em" }}>TROUBLESHOOTING</div>
          {[
            [
              "TINY IN MELD",
              "Use a fresh copied URL with scale=auto and browser size 1920 x 1080.",
            ],
            ["BLURRY", "Resize the source layer, not the browser viewport down to a tiny size."],
            ["VISIBLE BG", "The URL should include bg=0 for transparent background."],
          ].map(([title, desc]) => (
            <div
              key={title}
              style={{ color: DIM, fontSize: 5, letterSpacing: "0.06em", lineHeight: 1.8 }}
            >
              <span style={{ color: GOLD }}>{title}</span> - {desc}
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div
          style={{
            color: DIM,
            fontSize: 6,
            letterSpacing: "0.12em",
            textAlign: "center",
            opacity: 0.6,
            lineHeight: 2,
          }}
        >
          PASTE THIS URL INTO YOUR OBS / MELD / STREAMLABS BROWSER SOURCE
        </div>
      </div>
    </main>
  );
}
