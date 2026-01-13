export async function hashIP(ip: string): Promise<string> {
    // Normalize localhost IPv6 to IPv4 for consistent hashing in dev
    const normalizedIP = (ip === "::1" || ip === "::ffff:127.0.0.1") ? "127.0.0.1" : ip;

    const encoder = new TextEncoder();
    const data = encoder.encode(normalizedIP);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
