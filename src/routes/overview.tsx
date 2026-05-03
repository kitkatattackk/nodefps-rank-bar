import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/overview")({
  component: Overview,
});

const BG    = "#181510";
const BG2   = "#201c14";
const BG3   = "#252015";
const GOLD  = "#c9a84c";
const DIM   = "#6b5f3e";
const FRAME = "#2e2a1f";
const TEXT  = "#e8dfc4";

function useWindowWidth() {
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

/** Scales an iframe down to fit the available content width */
function ScaledIframe({ src, nativeW, nativeH, scale }: {
  src: string; nativeW: number; nativeH: number; scale: number;
}) {
  return (
    <div style={{ width: nativeW * scale, height: nativeH * scale, overflow: "hidden", flexShrink: 0 }}>
      <iframe
        src={src}
        scrolling="no"
        allowTransparency={true}
        style={{
          width: nativeW,
          height: nativeH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          border: "none",
          background: "transparent",
          pointerEvents: "none",
          display: "block",
        }}
      />
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      background: `${GOLD}18`,
      border: `1px solid ${GOLD}55`,
      color: GOLD,
      fontSize: 6,
      letterSpacing: "0.15em",
      padding: "3px 8px",
      whiteSpace: "nowrap" as const,
    }}>
      {children}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{
        color: DIM,
        fontSize: 6,
        letterSpacing: "0.25em",
        borderBottom: `1px solid ${DIM}33`,
        paddingBottom: 6,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function FeatureRow({ icon, label, desc }: { icon: string; label: string; desc: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <span style={{ color: GOLD, fontSize: 9, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <div>
        <div style={{ color: TEXT, fontSize: 7, letterSpacing: "0.12em", marginBottom: 3 }}>{label}</div>
        <div style={{ color: DIM, fontSize: 6, letterSpacing: "0.08em", lineHeight: 1.7 }}>{desc}</div>
      </div>
    </div>
  );
}

function UpcomingCard({ icon, iconColor, title, desc, badge, badgeColor }: {
  icon: string; iconColor: string; title: string; desc: string;
  badge: string; badgeColor: string;
}) {
  return (
    <div style={{
      background: BG3,
      border: `1px solid ${badgeColor}33`,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: iconColor, fontSize: 8 }}>{icon}</span>
        <span style={{ color: badgeColor === GOLD ? GOLD : TEXT, fontSize: 6, letterSpacing: "0.15em" }}>{title}</span>
      </div>
      <div style={{ color: DIM, fontSize: 5, letterSpacing: "0.08em", lineHeight: 1.9 }}>{desc}</div>
      <span style={{
        alignSelf: "flex-start" as const,
        background: `${badgeColor}18`,
        border: `1px solid ${badgeColor}44`,
        color: badgeColor,
        fontSize: 5,
        letterSpacing: "0.12em",
        padding: "2px 7px",
        marginTop: 2,
      }}>
        {badge}
      </span>
    </div>
  );
}

export default function Overview() {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 640;
  const sidePad = isMobile ? 16 : 32;
  // Available content width (capped at 700)
  const contentW = Math.min(windowWidth - sidePad * 2, 700);
  // Scale iframes to fit
  const iframeNativeW = 560;
  const iframeScale = Math.min(1, contentW / iframeNativeW);

  useEffect(() => {
    document.documentElement.style.background = BG;
    document.body.style.background = BG;
    return () => {
      document.documentElement.style.background = "";
      document.body.style.background = "";
    };
  }, []);

  return (
    <main style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${BG2} 0%, ${BG} 55%)`,
      fontFamily: "'Press Start 2P', monospace",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: `${isMobile ? 36 : 52}px ${sidePad}px 64px`,
      gap: isMobile ? 36 : 48,
    }}>

      {/* ── HERO ── */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ color: GOLD, fontSize: isMobile ? 13 : 18, letterSpacing: "0.25em" }}>
          RANK OVERLAY
        </div>
        <div style={{ color: DIM, fontSize: isMobile ? 6 : 7, letterSpacing: "0.2em" }}>
          FORTNITE · REAL-TIME STREAM WIDGET
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, justifyContent: "center", marginTop: 4 }}>
          <Pill>OBS</Pill>
          <Pill>MELD</Pill>
          <Pill>STREAMLABS</Pill>
          <Pill>TRANSPARENT BG</Pill>
          <Pill>ZERO BUILD · BATTLE ROYALE</Pill>
        </div>
      </div>

      {/* ── THREE STYLES ── */}
      <div style={{ width: "100%", maxWidth: 700 }}>
        <Section title="3 WIDGET STYLES">
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* FULL */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
                <span style={{ color: GOLD, fontSize: 7, letterSpacing: "0.18em" }}>FULL</span>
                <span style={{ color: DIM, fontSize: 6 }}>ZB tag · rank icon · progress bar · K/D</span>
                <span style={{ marginLeft: "auto", color: DIM, fontSize: 6, border: `1px solid ${DIM}44`, padding: "2px 6px", flexShrink: 0 }}>540 × 80px</span>
              </div>
              <div style={{ background: FRAME, border: `1px solid ${DIM}33`, padding: "16px 0", display: "flex", justifyContent: "center" }}>
                <ScaledIframe
                  src="/?rank=Champion&pct=55&kd=8.30&style=full&bg=0&mode=zb"
                  nativeW={560} nativeH={125} scale={iframeScale}
                />
              </div>
            </div>

            {/* COMPACT */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
                <span style={{ color: GOLD, fontSize: 7, letterSpacing: "0.18em" }}>COMPACT</span>
                <span style={{ color: DIM, fontSize: 6 }}>icon · rank · mini bar · K/D</span>
                <span style={{ marginLeft: "auto", color: DIM, fontSize: 6, border: `1px solid ${DIM}44`, padding: "2px 6px", flexShrink: 0 }}>340 × 36px</span>
              </div>
              <div style={{ background: FRAME, border: `1px solid ${DIM}33`, padding: "16px 0", display: "flex", justifyContent: "center" }}>
                <ScaledIframe
                  src="/?rank=Diamond+3&pct=41&kd=3.85&style=compact&bg=0"
                  nativeW={560} nativeH={60} scale={iframeScale}
                />
              </div>
            </div>

            {/* MICRO */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
                <span style={{ color: GOLD, fontSize: 7, letterSpacing: "0.18em" }}>MICRO</span>
                <span style={{ color: DIM, fontSize: 6 }}>icon · rank · K/D pill</span>
                <span style={{ marginLeft: "auto", color: DIM, fontSize: 6, border: `1px solid ${DIM}44`, padding: "2px 6px", flexShrink: 0 }}>220 × 30px</span>
              </div>
              <div style={{ background: FRAME, border: `1px solid ${DIM}33`, padding: "16px 0", display: "flex", justifyContent: "center" }}>
                <ScaledIframe
                  src="/?rank=Gold+2&pct=78&kd=1.42&style=micro&bg=0"
                  nativeW={560} nativeH={50} scale={iframeScale}
                />
              </div>
            </div>

          </div>
        </Section>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ width: "100%", maxWidth: 700, height: 1, background: `linear-gradient(90deg, transparent, ${DIM}44, transparent)` }} />

      {/* ── FEATURES + CONFIG ── */}
      <div style={{
        width: "100%",
        maxWidth: 700,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? 32 : 40,
      }}>

        {/* Features */}
        <Section title="FEATURES">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <FeatureRow icon="◆" label="ALL 8 RANKS" desc="Bronze through Unreal — unique icon, color, and glow per rank" />
            <FeatureRow icon="◆" label="ANIMATED K/D" desc="Smooth counter animation when K/D updates. Flashes on change." />
            <FeatureRow icon="◆" label="ZB + BR MODES" desc="Switch between Zero Build and Battle Royale rankings" />
            <FeatureRow icon="◆" label="TRANSPARENT BG" desc="Drop straight onto any stream layout with no background" />
            <FeatureRow icon="◆" label="PIXEL-ART HUD" desc="Retro game aesthetic — fits FPS and battle royale streams" />
            <FeatureRow icon="◆" label="NO-CODE SETUP" desc="Config page generates your OBS URL — no installs, no accounts" />
          </div>
        </Section>

        {/* Config UI mockup */}
        <Section title="CONFIG UI — /config">
          <div style={{
            background: BG3,
            border: `2px solid ${DIM}44`,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}>
            {[
              { label: "RANK",     value: "Unreal ▾" },
              { label: "MODE",     value: "[ ZB ]  BR" },
              { label: "PROGRESS", value: "████████░░  67%" },
              { label: "K/D",      value: "14.70" },
              { label: "STYLE",    value: "[ FULL ]  COMPACT  MICRO" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ color: DIM, fontSize: 5, letterSpacing: "0.2em" }}>{label}</div>
                <div style={{
                  background: FRAME,
                  border: `1px solid ${DIM}55`,
                  color: GOLD,
                  fontSize: 6,
                  padding: "5px 8px",
                  letterSpacing: "0.1em",
                }}>{value}</div>
              </div>
            ))}
            <div style={{ marginTop: 4, display: "flex", gap: 6 }}>
              <div style={{
                flex: 1, background: FRAME, border: `1px solid ${DIM}44`,
                color: DIM, fontSize: 5, padding: "5px 7px", letterSpacing: "0.05em",
                overflow: "hidden", whiteSpace: "nowrap" as const, textOverflow: "ellipsis",
              }}>
                https://your-site.vercel.app/?rank=Unreal&pct=67...
              </div>
              <div style={{
                background: GOLD, color: BG, fontSize: 5,
                padding: "5px 8px", letterSpacing: "0.1em", whiteSpace: "nowrap" as const,
              }}>
                COPY
              </div>
            </div>
            <div style={{ color: DIM, fontSize: 5, letterSpacing: "0.1em", lineHeight: 1.8, marginTop: 2 }}>
              Paste the generated URL into OBS / Meld / Streamlabs. No coding needed.
            </div>
          </div>
        </Section>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ width: "100%", maxWidth: 700, height: 1, background: `linear-gradient(90deg, transparent, ${DIM}44, transparent)` }} />

      {/* ── HOW IT WORKS ── */}
      <div style={{ width: "100%", maxWidth: 700 }}>
        <Section title="HOW IT WORKS">
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
            gap: 12,
          }}>
            {[
              { n: "01", title: "OPEN /CONFIG", desc: "Pick your rank, progress, K/D, and widget style" },
              { n: "02", title: "COPY URL",     desc: "Hit copy — your custom OBS browser source URL is ready" },
              { n: "03", title: "PASTE IN OBS", desc: "Add a Browser Source in OBS and paste the URL. Done." },
            ].map(({ n, title, desc }) => (
              <div key={n} style={{
                background: BG3, border: `1px solid ${DIM}33`, padding: 14,
                display: "flex", flexDirection: isMobile ? "row" as const : "column" as const,
                gap: isMobile ? 14 : 8, alignItems: isMobile ? "flex-start" as const : "stretch" as const,
              }}>
                <div style={{ color: `${GOLD}66`, fontSize: 11, flexShrink: 0 }}>{n}</div>
                <div>
                  <div style={{ color: GOLD, fontSize: 6, letterSpacing: "0.15em", marginBottom: 6 }}>{title}</div>
                  <div style={{ color: DIM, fontSize: 5, letterSpacing: "0.08em", lineHeight: 1.8 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ width: "100%", maxWidth: 700, height: 1, background: `linear-gradient(90deg, transparent, ${DIM}44, transparent)` }} />

      {/* ── UPCOMING FEATURES ── */}
      <div style={{ width: "100%", maxWidth: 700 }}>
        <Section title="UPCOMING FEATURES">
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 16,
          }}>
            <UpcomingCard
              icon="⟳" iconColor={GOLD} title="LIVE AUTO-REFRESH" badge="IN REVIEW" badgeColor={GOLD}
              desc="Stats update automatically every 30 seconds via the Tracker.gg API — no manual URL changes needed. Pending TRN production API approval."
            />
            <UpcomingCard
              icon="▲" iconColor={DIM} title="RANK-UP ALERT" badge="PLANNED" badgeColor={DIM}
              desc="Visual flash + sound effect triggered automatically when you rank up mid-stream."
            />
            <UpcomingCard
              icon="◈" iconColor={DIM} title="CUSTOM THEMES" badge="PLANNED" badgeColor={DIM}
              desc="Choose from multiple HUD color themes or build your own to match your stream branding."
            />
            <UpcomingCard
              icon="⊕" iconColor={DIM} title="MORE GAMES" badge="PLANNED" badgeColor={DIM}
              desc="Rocket League, Apex Legends, and Valorant rank overlays using the same pixel-art style."
            />
          </div>
        </Section>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ width: "100%", maxWidth: 700, height: 1, background: `linear-gradient(90deg, transparent, ${DIM}44, transparent)` }} />

      {/* ── FOOTER ── */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const, justifyContent: "center", marginTop: 8 }}>
        <a href="/preview" style={{ color: DIM, fontSize: 6, letterSpacing: "0.15em", textDecoration: "none", border: `1px solid ${DIM}44`, padding: "6px 14px" }}>
          VIEW PREVIEW
        </a>
        <a href="/config" style={{ color: GOLD, fontSize: 6, letterSpacing: "0.15em", textDecoration: "none", border: `1px solid ${GOLD}55`, padding: "6px 14px", background: `${GOLD}12` }}>
          BUILD YOUR URL →
        </a>
      </div>

    </main>
  );
}
