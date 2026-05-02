import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { getFortniteStats } from "@/server/fortnite.functions";
import overlayBg from "@/assets/node_overlay.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "nodeFPS — Fortnite Tracker" },
      { name: "description", content: "Live Fortnite ranked tracker widget for nodeFPS streams." },
    ],
  }),
});

type StatsResult = Awaited<ReturnType<typeof getFortniteStats>>;

const RANKED_COLORS: Record<string, string> = {
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
  const key = Object.keys(RANKED_COLORS).find((k) => division.toLowerCase().includes(k));
  return key ? RANKED_COLORS[key] : "#807149";
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-2 border-[hsl(var(--frame))] bg-[hsl(var(--paper))]/60 px-3 py-2 relative">
      <div className="absolute -top-[3px] -left-[3px] w-2 h-2 border-l-2 border-t-2 border-[hsl(var(--frame))]" />
      <div className="absolute -top-[3px] -right-[3px] w-2 h-2 border-r-2 border-t-2 border-[hsl(var(--frame))]" />
      <div className="absolute -bottom-[3px] -left-[3px] w-2 h-2 border-l-2 border-b-2 border-[hsl(var(--frame))]" />
      <div className="absolute -bottom-[3px] -right-[3px] w-2 h-2 border-r-2 border-b-2 border-[hsl(var(--frame))]" />
      <div className="text-[10px] tracking-[0.2em] uppercase opacity-70">{label}</div>
      <div className="text-2xl font-bold tabular-nums leading-none mt-1">{value}</div>
    </div>
  );
}

function RankCard({ title, mode }: { title: string; mode: any }) {
  const division = mode?.currentDivision?.name ?? mode?.currentDivision ?? null;
  const progress = typeof mode?.promotionProgress === "number" ? mode.promotionProgress : 0;
  const color = rankColor(typeof division === "string" ? division : null);

  return (
    <div className="border-2 border-[hsl(var(--frame))] bg-[hsl(var(--paper))]/40 p-4 relative">
      <div className="text-[10px] tracking-[0.25em] uppercase opacity-70 mb-1">{title}</div>
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-xl font-bold uppercase tracking-wide" style={{ color }}>
          {division || "Unranked"}
        </div>
        <div className="text-xs opacity-70 tabular-nums">
          {Math.round((progress || 0) * 100)}%
        </div>
      </div>
      <div className="mt-2 h-2 bg-[hsl(var(--frame))]/20 border border-[hsl(var(--frame))]/40 overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${Math.round((progress || 0) * 100)}%`, background: color }}
        />
      </div>
    </div>
  );
}

function Index() {
  const [name, setName] = useState("nodeFPS");
  const [input, setInput] = useState("nodeFPS");
  const [accountType, setAccountType] = useState<"epic" | "xbl" | "psn">("epic");
  const [data, setData] = useState<StatsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getFortniteStats({ data: { name, accountType } });
      setData(res);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, [name, accountType]);

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, [load]);

  const ranked = data?.ranked;
  const br = Array.isArray(ranked) ? ranked.find((r: any) => r.rankingType === "ranked-br") : null;
  const zb = Array.isArray(ranked) ? ranked.find((r: any) => r.rankingType === "ranked-zb") : null;

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 font-mono"
      style={{
        backgroundColor: "hsl(var(--paper))",
        backgroundImage:
          "linear-gradient(hsl(var(--frame) / 0.06) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--frame) / 0.06) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div
        className="w-full max-w-5xl border-4 border-[hsl(var(--frame))] relative shadow-2xl"
        style={{
          backgroundImage: `url(${overlayBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* corner decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[hsl(var(--frame))]" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[hsl(var(--frame))]" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[hsl(var(--frame))]" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[hsl(var(--frame))]" />

        <div className="bg-[hsl(var(--paper))]/85 backdrop-blur-[1px] p-6 md:p-8">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 border-b-2 border-[hsl(var(--frame))] pb-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[hsl(var(--frame))] leading-none">
                nodeFPS
              </h1>
              <p className="text-xs tracking-[0.3em] uppercase mt-1 opacity-80">
                Focus • Precision • Dominate
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase opacity-70">
              <span className={`w-2 h-2 ${loading ? "bg-yellow-600 animate-pulse" : "bg-[hsl(var(--frame))]"}`} />
              {loading ? "Syncing" : `Live • ${lastUpdated?.toLocaleTimeString() ?? "—"}`}
            </div>
          </header>

          {/* Controls */}
          <form
            className="flex flex-col sm:flex-row gap-2 mb-6"
            onSubmit={(e) => {
              e.preventDefault();
              setName(input.trim() || "nodeFPS");
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Epic username"
              className="flex-1 bg-transparent border-2 border-[hsl(var(--frame))] px-3 py-2 text-sm uppercase tracking-wider focus:outline-none focus:bg-[hsl(var(--paper))]/60"
            />
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as "epic" | "xbl" | "psn")}
              className="bg-[hsl(var(--paper))] border-2 border-[hsl(var(--frame))] px-3 py-2 text-sm uppercase tracking-wider"
            >
              <option value="epic">Epic</option>
              <option value="xbl">Xbox</option>
              <option value="psn">PSN</option>
            </select>
            <button
              type="submit"
              className="border-2 border-[hsl(var(--frame))] bg-[hsl(var(--frame))] text-[hsl(var(--paper))] px-5 py-2 text-sm uppercase tracking-[0.2em] font-bold hover:bg-[hsl(var(--frame))]/85 transition-colors"
            >
              Track
            </button>
          </form>

          {/* Error / empty */}
          {data?.error && (
            <div className="border-2 border-dashed border-[hsl(var(--frame))] p-4 text-center text-sm uppercase tracking-wider mb-6">
              {data.error}
            </div>
          )}

          {/* Player */}
          {data?.stats && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[10px] tracking-[0.25em] uppercase opacity-70">Operator</div>
                  <div className="text-2xl font-bold">{data.stats.name}</div>
                </div>
                {data.stats.level != null && (
                  <div className="text-right">
                    <div className="text-[10px] tracking-[0.25em] uppercase opacity-70">BP Level</div>
                    <div className="text-2xl font-bold tabular-nums">{data.stats.level}</div>
                  </div>
                )}
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <StatBox label="Wins" value={data.stats.wins.toLocaleString()} />
                <StatBox label="Kills" value={data.stats.kills.toLocaleString()} />
                <StatBox label="K/D" value={data.stats.kd.toFixed(2)} />
                <StatBox label="Win %" value={`${data.stats.winRate.toFixed(1)}%`} />
                <StatBox label="Matches" value={data.stats.matches.toLocaleString()} />
                <StatBox label="Top 10" value={data.stats.top10.toLocaleString()} />
                <StatBox
                  label="Hours"
                  value={Math.round(data.stats.minutesPlayed / 60).toLocaleString()}
                />
                <StatBox
                  label="K/Match"
                  value={
                    data.stats.matches > 0
                      ? (data.stats.kills / data.stats.matches).toFixed(2)
                      : "0.00"
                  }
                />
              </div>

              {/* Ranked */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <RankCard title="Ranked Battle Royale" mode={br} />
                <RankCard title="Ranked Zero Build" mode={zb} />
              </div>
            </>
          )}

          {/* Footer */}
          <footer className="mt-6 pt-4 border-t-2 border-[hsl(var(--frame))] flex flex-wrap gap-x-4 gap-y-1 text-[10px] tracking-[0.2em] uppercase opacity-70">
            <span>◎ @nodeFPS</span>
            <span>▶ /nodeFPS</span>
            <span>◇ @nodeFPS</span>
            <span className="ml-auto">Auto-refresh • 60s</span>
          </footer>
        </div>
      </div>
    </main>
  );
}
