import type { APIRoute } from 'astro';
import { hashIP } from '../../utils/security';

export const GET: APIRoute = async ({ request, locals }) => {
    let country = request.headers.get("cf-ipcountry");
    let city = request.headers.get("cf-ipcity");

    // Fallback for local development if Cloudflare headers are missing
    if (!country) {
        try {
            const res = await fetch("http://ip-api.com/json/");
            if (res.ok) {
                const data = await res.json() as any;
                country = data.countryCode;
                city = data.city;
            }
        } catch (e) {
            console.error("Failed to fetch fallback location", e);
        }
    }

    country = country || "XX";
    city = city || "Unknown Location";

    // Check for existing vote
    let hasVoted = false;
    let voteType = null;

    try {
        const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "127.0.0.1";
        const ipHash = await hashIP(ip);

        // @ts-ignore
        const db = locals.runtime.env.DB;
        if (db) {
            const existingVote = await db.prepare("SELECT vote_type FROM votes WHERE ip_hash = ?").bind(ipHash).first();
            if (existingVote) {
                hasVoted = true;
                voteType = existingVote.vote_type;
            }
        }
    } catch (e) {
        console.error("Failed to check vote status", e);
    }

    return new Response(JSON.stringify({
        country,
        city,
        display: country === "XX" ? "Unknown Origin" : `${city}, ${country}`,
        hasVoted,
        voteType
    }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
        }
    });
};
