import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { getFortniteStats } from "@/server/fortnite.functions";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "nodeFPS — Rank Bar" },
      { name: "description", content: "Compact Fortnite ranked stream overlay for nodeFPS." },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap",
      },
    ],
  }),
});

const RANK_COLORS: Record<string, string> = {
  bronze:   "#cd7f32",
  silver:   "#c0c0c0",
  gold:     "#ffd700",
  platinum: "#3cc9c0",
  diamond:  "#5b9bd5",
  elite:    "#d946a8",
  champion: "#e84c1e",
  unreal:   "#7ee8fa",
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

function useQueryParam(key: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  return new URLSearchParams(window.location.search).get(key) || fallback;
}

function Index() {
  const [name] = useState(() => useQueryParam("name", "nodeFPS"));
  const [accountType] = useState(
    () => (useQueryParam("type", "epic") as "epic" | "xbl" | "psn"),
  );
  const mode = useQueryParam("mode", "zb"); // "br" or "zb"
  const transparent = useQueryParam("bg", "1") === "0";

  // Manual rank override via URL params: ?rank=Elite+1&pct=13
  const rankOverride = useQueryParam("rank", "");
  const pctOverride = useQueryParam("pct", "");

  const [data, setData] = useState<Awaited<ReturnType<typeof getFortniteStats>> | null>(null);

  const load = useCallback(async () => {
    const res = await getFortniteStats({ data: { name, accountType } });
    setData(res);
  }, [name, accountType]);

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

  const division: string = rankOverride || "Unranked";
  const pct: number = pctOverride ? Math.min(100, Math.max(0, parseInt(pctOverride, 10))) : 0;
  const color = rankColor(division);
  const targetKd = data?.stats?.kd ?? 0;
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
          width: "100%",
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
            <div style={{ filter: `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 16px ${color}80)` }}>
              <RankIcon division={division} size={52} />
            </div>
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
            className="flex flex-col justify-center px-3 py-2 min-w-[72px] items-end"
            style={{
              transition: "background 0.3s",
              background: flash ? `${color}22` : "transparent",
            }}
          >
            <div style={{ fontSize: 6, opacity: 0.7, letterSpacing: "0.15em" }}>
              K/D
            </div>
            <div
              className="tabular-nums"
              style={{
                fontSize: 12,
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
