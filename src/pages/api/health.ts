import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
    return new Response(JSON.stringify({
        status: "operational",
        system: "Project 51",
        timestamp: new Date().toISOString()
    }), {
        headers: {
            "Content-Type": "application/json"
        }
    });
}
