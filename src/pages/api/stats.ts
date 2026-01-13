import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
    // @ts-ignore
    const db = locals.runtime.env.DB;

    if (!db) {
        return new Response(JSON.stringify({ error: "Database not available" }), { status: 500 });
    }

    try {
        // Fetch raw counts grouped by country and type
        const { results } = await db.prepare(
            "SELECT country_code, vote_type, COUNT(*) as count FROM votes GROUP BY country_code, vote_type"
        ).all();

        // Transform to nested object: { "US": { "yes": 10, "no": 5 } }
        const stats: Record<string, { yes: number; no: number }> = {};

        results.forEach((row: any) => {
            if (!stats[row.country_code]) {
                stats[row.country_code] = { yes: 0, no: 0 };
            }
            if (row.vote_type === 'yes') {
                stats[row.country_code].yes = row.count;
            } else if (row.vote_type === 'no') {
                stats[row.country_code].no = row.count;
            }
        });

        return new Response(JSON.stringify(stats), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=10"
            }
        });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Failed to fetch stats" }), { status: 500 });
    }
}
