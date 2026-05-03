export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const name = url.searchParams.get("name") ?? "nodefps";
  const accountType = url.searchParams.get("accountType") ?? "epic";

  const apiKey = process.env.FORTNITE_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured", stats: null }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://fortnite-api.com/v2/stats/br/v2?name=${encodeURIComponent(name)}&accountType=${accountType}&timeWindow=season`,
      { headers: { Authorization: apiKey } },
    );

    if (!res.ok) {
      return Response.json(
        { error: res.status === 404 ? "Player not found" : `API error (${res.status})`, stats: null },
        { status: res.status },
      );
    }

    const json = (await res.json()) as any;
    const overall = json?.data?.stats?.all?.overall ?? null;

    return Response.json({
      error: null,
      stats: { kd: overall?.kd ?? 0 },
    });
  } catch {
    return Response.json({ error: "Failed to fetch stats", stats: null }, { status: 500 });
  }
}
