import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
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
  bronze: "#a87a3d",
  silver: "#b9c2c9",
  gold: "#d4a830",
  platinum: "#7fc7c5",
  diamond: "#7aa6e6",
  elite: "#a771c9",
  champion: "#d96a6a",
  unreal: "#e8c462",
};

function rankColor(division?: string | null) {
  if (!division) return "#807149";
  const key = Object.keys(RANK_COLORS).find((k) => division.toLowerCase().includes(k));
  return key ? RANK_COLORS[key] : "#807149";
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
  const mode = useQueryParam("mode", "br"); // "br" or "zb"
  const transparent = useQueryParam("bg", "1") === "0";

  const [data, setData] = useState<Awaited<ReturnType<typeof getFortniteStats>> | null>(null);

  const load = useCallback(async () => {
    const res = await getFortniteStats({ data: { name, accountType } });
    setData(res);
  }, [name, accountType]);

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, [load]);

  const ranked = Array.isArray(data?.ranked) ? data!.ranked : [];
  const target = ranked.find(
    (r: any) => r.rankingType === (mode === "zb" ? "ranked-zb" : "ranked-br"),
  );
  const division: string =
    target?.currentDivision?.name ?? target?.currentDivision ?? "Unranked";
  const progress: number =
    typeof target?.promotionProgress === "number" ? target.promotionProgress : 0;
  const color = rankColor(division);
  const kd = data?.stats?.kd ?? 0;
  const pct = Math.round(progress * 100);

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
          minWidth: 380,
          maxWidth: 600,
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
            className="flex items-center justify-center px-2"
            style={{
              background: "hsl(var(--frame))",
              color: "hsl(var(--paper))",
              fontSize: 8,
              letterSpacing: "0.1em",
            }}
          >
            {mode === "zb" ? "ZB" : "BR"}
          </div>

          {/* Rank */}
          <div
            className="flex flex-col justify-center px-3 py-2 min-w-[130px]"
            style={{ borderRight: "2px solid hsl(var(--frame))" }}
          >
            <div style={{ fontSize: 6, opacity: 0.7, letterSpacing: "0.15em" }}>
              RANK
            </div>
            <div
              className="uppercase truncate"
              style={{ color, fontSize: 10, marginTop: 6, textShadow: "1px 1px 0 hsl(var(--frame) / 0.25)" }}
            >
              {division}
            </div>
          </div>

          {/* Promotion bar */}
          <div
            className="flex-1 flex flex-col justify-center px-3 py-2"
            style={{ borderRight: "2px solid hsl(var(--frame))" }}
          >
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 6, letterSpacing: "0.15em", opacity: 0.7 }}>
                NEXT
              </span>
              <span style={{ fontSize: 8 }} className="tabular-nums">
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
          <div className="flex flex-col justify-center px-3 py-2 min-w-[72px] items-end">
            <div style={{ fontSize: 6, opacity: 0.7, letterSpacing: "0.15em" }}>
              K/D
            </div>
            <div className="tabular-nums" style={{ fontSize: 12, marginTop: 6 }}>
              {kd.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
