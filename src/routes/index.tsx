import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

const RANK_COLORS: Record<string, string> = {
  bronze:   "#b5651d",  // darker bronze — readable on beige
  silver:   "#7a7a8c",  // muted slate — not washed out on light bg
  gold:     "#c8820a",  // deep amber-gold — high contrast on beige
  platinum: "#2aaba2",  // slightly deepened teal
  diamond:  "#4080c0",  // slightly deeper blue
  elite:    "#d946a8",
  champion: "#e84c1e",
  unreal:   "#5548d9",
};

function rankKey(division?: string | null): string | null {
  if (!division) return null;
  return Object.keys(RANK_COLORS).find((k) => division.toLowerCase().includes(k)) ?? null;
}

function rankColor(division?: string | null) {
  const key = rankKey(division);
  return key ? RANK_COLORS[key] : "#807149";
}

const RANK_IMAGES: Record<string, string> = {
  bronze:   "/ranks/fortnite-bronze-2.webp",
  silver:   "/ranks/fortnite-silver-3.webp",
  gold:     "/ranks/fortnite-gold-3.webp",
  platinum: "/ranks/fortnite-platinum-3.webp",
  diamond:  "/ranks/fortnite-diamond-3.webp",
  elite:    "/ranks/Elite_-_Icon_-_Fortnite.webp",
  champion: "/ranks/fortnite-champion.webp",
  unreal:   "/ranks/unreal.png",
};

function RankIcon({ division, size = 40 }: { division: string; size?: number }) {
  const key = rankKey(division);
  const src = key ? RANK_IMAGES[key] : null;
  if (!src) return <div style={{ width: size, height: size }} />;
  return (
    <img
      src={src}
      alt={division}
      width={size}
      height={size}
      style={{ objectFit: "contain", imageRendering: "auto" }}
    />
  );
}

function GlowIcon({ division, size, color }: { division: string; size: number; color: string }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {/* Radial glow layer behind the icon — doesn't follow image bounding box */}
      <div style={{
        position: "absolute",
        inset: -size * 0.35,
        background: `radial-gradient(circle, ${color}90 0%, ${color}40 40%, transparent 70%)`,
        filter: `blur(${Math.round(size * 0.22)}px)`,
        pointerEvents: "none",
      }} />
      <div style={{ position: "relative" }}>
        <RankIcon division={division} size={size} />
      </div>
    </div>
  );
}

function useQueryParam(key: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  return new URLSearchParams(window.location.search).get(key) || fallback;
}

function Index() {
  const [name] = useState(() => useQueryParam("name", "nodeFPS"));
  const mode = useQueryParam("mode", "zb");
  const transparent = useQueryParam("bg", "1") === "0";
  const style = useQueryParam("style", "full");

  // Manual fallbacks for local dev / preview (?rank=Elite+1&pct=13&kd=3.50)
  const rankOverride = useQueryParam("rank", "");
  const pctOverride  = useQueryParam("pct", "");
  const kdOverride   = useQueryParam("kd", "");

  const [data, setData] = useState<{
    error: string | null;
    stats: { division: string; pct: number; kd: number } | null;
  } | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/stats?name=${encodeURIComponent(name)}&mode=${mode}`);
    const json = await res.json();
    setData(json);
  }, [name, mode]);

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, [load]);

  useEffect(() => {
    if (transparent) {
      document.documentElement.style.background = "transparent";
      document.body.style.background = "transparent";
    }
  }, [transparent]);

  const division: string = (data?.stats?.division ?? rankOverride) || "Unranked";
  const pct: number = data?.stats?.pct ?? (pctOverride ? parseInt(pctOverride, 10) : 0);
  const color = rankColor(division);
  const targetKd = data?.stats?.kd ?? (kdOverride ? parseFloat(kdOverride) : 0);
  const [displayKd, setDisplayKd] = useState(targetKd);
  const [flash, setFlash] = useState(false);
  const prevKd = useRef(targetKd);

  useEffect(() => {
    if (targetKd === prevKd.current) return;
    const from = prevKd.current;
    const to = targetKd;
    prevKd.current = to;
    setFlash(true);
    setTimeout(() => setFlash(false), 600);
    const duration = 800;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayKd(from + (to - from) * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [targetKd]);

  // ─────────────────────────────────────────────
  // STYLE: MICRO  (?style=micro)
  // Ultra-minimal pill — icon + rank name + K/D only, no bar, no labels
  // Recommended OBS browser source size: ~220×30
  // ─────────────────────────────────────────────
  if (style === "micro") {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{
        background: "transparent",
        fontFamily: "'Press Start 2P', monospace",
      }}>
        <div
          className="flex items-center gap-2 px-2 py-1"
          style={{
            background: "hsl(var(--paper))",
            border: "2px solid hsl(var(--frame))",
            color: "hsl(var(--frame))",
          }}
        >
          <GlowIcon division={division} size={20} color={color} />
          <span className="uppercase" style={{ color, fontSize: 9, whiteSpace: "nowrap" }}>
            {division}
          </span>
          <span style={{ opacity: 0.4, fontSize: 8 }}>|</span>
          <span
            className="tabular-nums"
            style={{
              fontSize: 9,
              color: flash ? color : "inherit",
              transition: "color 0.3s",
              whiteSpace: "nowrap",
            }}
          >
            {displayKd.toFixed(2)} K/D
          </span>
        </div>
      </main>
    );
  }

  // ─────────────────────────────────────────────
  // STYLE: COMPACT  (?style=compact)
  // Minimal single-line bar — icon, rank, progress, K/D
  // Recommended OBS browser source size: ~340×36
  // ─────────────────────────────────────────────
  if (style === "compact") {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "transparent",
          fontFamily: "'Press Start 2P', monospace",
        }}
      >
        <div
          className="flex items-center gap-3 px-3 py-1"
          style={{
            background: "hsl(var(--paper))",
            border: "2px solid hsl(var(--frame))",
            color: "hsl(var(--frame))",
          }}
        >
          {/* Rank icon */}
          <GlowIcon division={division} size={28} color={color} />

          {/* Rank name */}
          <span
            className="uppercase"
            style={{ color, fontSize: 11, whiteSpace: "nowrap" }}
          >
            {division}
          </span>

          {/* Mini progress bar */}
          <div
            className="flex gap-[2px]"
            style={{
              padding: 2,
              border: "2px solid hsl(var(--frame))",
              background: "hsl(var(--frame) / 0.1)",
            }}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  background: i < Math.round((pct / 100) * 10) ? color : "hsl(var(--frame) / 0.15)",
                }}
              />
            ))}
          </div>

          {/* K/D */}
          <span
            className="tabular-nums"
            style={{
              fontSize: 11,
              color: flash ? color : "inherit",
              transition: "color 0.3s",
              background: flash ? `${color}22` : "transparent",
              whiteSpace: "nowrap",
            }}
          >
            {displayKd.toFixed(2)} K/D
          </span>
        </div>
      </main>
    );
  }

  // ─────────────────────────────────────────────
  // STYLE: FULL  (?style=full  — default)
  // Full pixel-art HUD bar — ZB/BR tag, rank icon, progress bar, K/D
  // Recommended OBS browser source size: ~540×80
  // ─────────────────────────────────────────────
  return (
    <main
      className="min-h-screen flex items-center justify-center p-3"
      style={{
        background: transparent ? "transparent" : "hsl(var(--paper))",
        fontFamily: "'Press Start 2P', monospace",
        imageRendering: "pixelated",
      }}
    >
      {/* Pixel-art frame: outer dark border + inner paper, layered like the overlay */}
      <div
        className="relative"
        style={{
          width: 520,
          padding: 4,
          background: "hsl(var(--frame))",
          boxShadow:
            "0 0 0 4px hsl(var(--paper)), 0 0 0 8px hsl(var(--frame))",
        }}
      >
        <div
          className="flex items-stretch"
          style={{
            background: "hsl(var(--paper))",
            color: "hsl(var(--frame))",
            border: "2px solid hsl(var(--frame))",
          }}
        >
          {/* Corner pluses for pixel-art HUD feel */}
          <span className="absolute -top-0.5 -left-0.5 text-[10px] leading-none" style={{ color: "hsl(var(--paper))" }}>+</span>
          <span className="absolute -top-0.5 -right-0.5 text-[10px] leading-none" style={{ color: "hsl(var(--paper))" }}>+</span>
          <span className="absolute -bottom-0.5 -left-0.5 text-[10px] leading-none" style={{ color: "hsl(var(--paper))" }}>+</span>
          <span className="absolute -bottom-0.5 -right-0.5 text-[10px] leading-none" style={{ color: "hsl(var(--paper))" }}>+</span>

          {/* Mode tag */}
          <div
            className="flex items-center justify-center px-3"
            style={{
              background: "hsl(var(--frame))",
              color: "hsl(var(--paper))",
              fontSize: 11,
              letterSpacing: "0.1em",
            }}
          >
            {mode === "zb" ? "ZB" : "BR"}
          </div>

          {/* Rank */}
          <div
            className="flex items-center gap-3 px-4 py-2 min-w-[180px]"
            style={{ borderRight: "2px solid hsl(var(--frame))" }}
          >
            <GlowIcon division={division} size={52} color={color} />
            <div className="flex flex-col justify-center">
              <div style={{ fontSize: 7, opacity: 0.7, letterSpacing: "0.15em" }}>
                RANK
              </div>
              <div
                className="uppercase truncate"
                style={{ color, fontSize: 14, marginTop: 6, textShadow: "1px 1px 0 hsl(var(--frame) / 0.25)" }}
              >
                {division}
              </div>
            </div>
          </div>

          {/* Promotion bar */}
          <div
            className="flex-1 flex flex-col justify-center px-3 py-2"
            style={{ borderRight: "2px solid hsl(var(--frame))" }}
          >
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 9, letterSpacing: "0.15em", opacity: 0.7 }}>
                NEXT
              </span>
              <span style={{ fontSize: 12 }} className="tabular-nums">
                {pct}%
              </span>
            </div>
            {/* Pixel progress bar: chunky blocks */}
            <div
              className="mt-2 flex gap-[2px]"
              style={{
                padding: 2,
                border: "2px solid hsl(var(--frame))",
                background: "hsl(var(--frame) / 0.1)",
              }}
            >
              {Array.from({ length: 16 }).map((_, i) => {
                const filled = i < Math.round((pct / 100) * 16);
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 8,
                      background: filled ? color : "hsl(var(--frame) / 0.15)",
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* K/D */}
          <div
            className="flex flex-col justify-center px-4 py-2 min-w-[90px] items-end"
            style={{
              transition: "background 0.3s",
              background: flash ? `${color}22` : "transparent",
            }}
          >
            <div style={{ fontSize: 8, opacity: 0.7, letterSpacing: "0.15em" }}>
              K/D
            </div>
            <div
              className="tabular-nums"
              style={{
                fontSize: 18,
                marginTop: 6,
                color: flash ? color : "inherit",
                transition: "color 0.3s",
              }}
            >
              {displayKd.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
