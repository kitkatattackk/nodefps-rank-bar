export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const name = url.searchParams.get("name") ?? "nodefps";
  const mode = url.searchParams.get("mode") ?? "zb";

  // TODO: remove mock data once TRN API is approved for production
  return Response.json({
    error: null,
    stats: { division: "Unreal", pct: 67, kd: 14.70 },
  });

  const apiKey = process.env.TRN_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured", stats: null }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.tracker.gg/api/v2/fortnite/standard/profile/epic/${encodeURIComponent(name)}`,
      { headers: { "TRN-Api-Key": apiKey, "Accept-Encoding": "identity" } },
    );

    if (!res.ok) {
      return Response.json(
        { error: res.status === 404 ? "Player not found" : `API error (${res.status})`, stats: null },
        { status: res.status },
      );
    }

    const json = (await res.json()) as any;
    const segments: any[] = json?.data?.segments ?? [];
    const debug = url.searchParams.get("debug") === "1";

    // Return raw segment map for debugging
    if (debug) {
      return Response.json({
        segments: segments.map((s) => ({
          type: s.type,
          attributes: s.attributes,
          metadataName: s.metadata?.name,
          statKeys: Object.keys(s.stats ?? {}),
          rankStat: s.stats?.rank,
          promotionProgress: s.stats?.promotionProgress,
          rankScore: s.stats?.rankScore,
          kd: s.stats?.kd,
        })),
      });
    }

    // Find the ranked playlist segment matching the mode
    const rankedSegment = segments.find((s) => {
      if (s.type !== "playlist") return false;
      const id: string = (s.attributes?.playlistId ?? "").toLowerCase();
      const sName: string = (s.metadata?.name ?? "").toLowerCase();
      return mode === "zb"
        ? id.includes("ranked-zb") || (sName.includes("ranked") && sName.includes("zero"))
        : id.includes("ranked-br") || (sName.includes("ranked") && !sName.includes("zero"));
    });

    // Overview segment for season K/D
    const overviewSegment = segments.find((s) => s.type === "overview");

    const rankMeta = rankedSegment?.stats?.rank?.metadata ?? {};
    const tierName: string = rankMeta.tierName ?? rankMeta.rankName ?? "";
    const divisionName: string = String(rankMeta.divisionName ?? rankMeta.division ?? "").trim();
    const division = tierName
      ? divisionName
        ? `${tierName} ${divisionName}`
        : tierName
      : "Unranked";

    const pct = Math.round(
      rankedSegment?.stats?.promotionProgress?.value ??
      rankedSegment?.stats?.rankScore?.value ??
      0,
    );

    const kd: number = overviewSegment?.stats?.kd?.value ?? 0;

    return Response.json({ error: null, stats: { division, pct, kd } });
  } catch (err) {
    return Response.json({ error: "Failed to fetch stats", stats: null }, { status: 500 });
  }
}
