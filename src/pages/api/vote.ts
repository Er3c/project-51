import type { APIRoute } from 'astro';
import { hashIP } from '../../utils/security';

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const body = await request.json();
        const { country, vote } = body as { country: string, vote: 'yes' | 'no' };

        if (!vote) {
            return new Response(JSON.stringify({ error: "Missing vote type" }), { status: 400 });
        }

        const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "127.0.0.1";
        const ipHash = await hashIP(ip);

        // Access D1 database
        // @ts-ignore - DB type might not be fully inferred yet in locals
        const db = locals.runtime.env.DB;

        if (!db) {
            return new Response(JSON.stringify({ error: "Database not available" }), { status: 500 });
        }

        // Check for existing vote from this IP
        const existingVote = await db.prepare("SELECT id FROM votes WHERE ip_hash = ?").bind(ipHash).first();
        if (existingVote) {
            return new Response(JSON.stringify({ error: "You have already voted." }), { status: 409 });
        }

        const { success } = await db.prepare(
            "INSERT INTO votes (country_code, vote_type, ip_hash) VALUES (?, ?, ?)"
        ).bind(country, vote, ipHash).run();

        if (!success) {
            return new Response(JSON.stringify({ error: "Failed to persist vote" }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: "Vote recorded", country, vote }), { status: 200 });

    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
