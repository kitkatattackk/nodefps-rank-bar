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
      className="min-h-screen flex items-center justify-center p-3 font-mono"
      style={{ background: transparent ? "transparent" : "hsl(var(--paper))" }}
    >
      <div
        className="flex items-stretch border-2 border-[hsl(var(--frame))] bg-[hsl(var(--paper))] text-[hsl(var(--frame))] shadow-md"
        style={{ minWidth: 360, maxWidth: 560, width: "100%" }}
      >
        {/* Mode tag */}
        <div
          className="flex items-center justify-center px-2 text-[9px] font-black tracking-[0.2em] uppercase"
          style={{ background: "hsl(var(--frame))", color: "hsl(var(--paper))" }}
        >
          {mode === "zb" ? "ZB" : "BR"}
        </div>

        {/* Rank */}
        <div className="flex flex-col justify-center px-3 py-1.5 border-r-2 border-[hsl(var(--frame))] min-w-[120px]">
          <div className="text-[8px] tracking-[0.25em] uppercase opacity-70 leading-none">
            Rank
          </div>
          <div
            className="text-sm font-black uppercase tracking-wide leading-tight truncate"
            style={{ color }}
          >
            {division}
          </div>
        </div>

        {/* Promotion bar */}
        <div className="flex-1 flex flex-col justify-center px-3 py-1.5 border-r-2 border-[hsl(var(--frame))]">
          <div className="flex items-baseline justify-between leading-none">
            <span className="text-[8px] tracking-[0.25em] uppercase opacity-70">
              Next Rank
            </span>
            <span className="text-[11px] font-bold tabular-nums">{pct}%</span>
          </div>
          <div className="mt-1 h-1.5 bg-[hsl(var(--frame))]/15 border border-[hsl(var(--frame))]/40 overflow-hidden">
            <div
              className="h-full transition-all duration-700"
              style={{ width: `${pct}%`, background: color }}
            />
          </div>
        </div>

        {/* K/D */}
        <div className="flex flex-col justify-center px-3 py-1.5 min-w-[64px] items-end">
          <div className="text-[8px] tracking-[0.25em] uppercase opacity-70 leading-none">
            K/D
          </div>
          <div className="text-base font-black tabular-nums leading-tight">
            {kd.toFixed(2)}
          </div>
        </div>
      </div>
    </main>
  );
}
