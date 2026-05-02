import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  name: z.string().min(1).max(50),
  accountType: z.enum(["epic", "xbl", "psn"]).default("epic"),
});

export const getFortniteStats = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.FORTNITE_API_KEY;
    if (!apiKey) {
      return { error: "API key not configured", stats: null, ranked: null };
    }

    try {
      // Stats v2 (BR overall)
      const statsRes = await fetch(
        `https://fortnite-api.com/v2/stats/br/v2?name=${encodeURIComponent(data.name)}&accountType=${data.accountType}`,
        { headers: { Authorization: apiKey } },
      );

      if (!statsRes.ok) {
        return {
          error: statsRes.status === 404 ? "Player not found" : `API error (${statsRes.status})`,
          stats: null,
          ranked: null,
        };
      }
      const statsJson = (await statsRes.json()) as any;
      const account = statsJson?.data?.account;
      const overall = statsJson?.data?.stats?.all?.overall ?? null;

      // Ranked (current season BR + ZB)
      let ranked: any = null;
      if (account?.id) {
        const rankedRes = await fetch(
          `https://fortnite-api.com/v2/stats/br/v2/ranked?accountId=${account.id}`,
          { headers: { Authorization: apiKey } },
        );
        if (rankedRes.ok) {
          const rankedJson = (await rankedRes.json()) as any;
          ranked = rankedJson?.data ?? null;
        }
      }

      return {
        error: null,
        stats: {
          name: account?.name ?? data.name,
          level: statsJson?.data?.battlePass?.level ?? null,
          wins: overall?.wins ?? 0,
          kills: overall?.kills ?? 0,
          kd: overall?.kd ?? 0,
          matches: overall?.matches ?? 0,
          winRate: overall?.winRate ?? 0,
          top10: overall?.top10 ?? 0,
          minutesPlayed: overall?.minutesPlayed ?? 0,
        },
        ranked,
      };
    } catch (err) {
      console.error("Fortnite API error:", err);
      return { error: "Failed to fetch stats", stats: null, ranked: null };
    }
  });
