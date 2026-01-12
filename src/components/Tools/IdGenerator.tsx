import React, { useRef, useState, useEffect } from 'react';
import QRCode from 'qrcode';

const IdGenerator = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);

    // Constants for card design
    const CARD_WIDTH = 600;
    const CARD_HEIGHT = 380;

    const drawCard = async () => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        setLoading(true);

        // Background
        const gradient = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
        gradient.addColorStop(0, '#e2e8f0'); // Slate 200
        gradient.addColorStop(1, '#cbd5e1'); // Slate 300
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

        // Decorative patterns (Iceberg abstract)
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, CARD_HEIGHT - 100);
        ctx.lineTo(200, CARD_HEIGHT - 250);
        ctx.lineTo(400, CARD_HEIGHT - 150);
        ctx.lineTo(600, CARD_HEIGHT - 300);
        ctx.stroke();

        // Header Band
        ctx.fillStyle = '#1e293b'; // Slate 800
        ctx.fillRect(0, 0, CARD_WIDTH, 80);

        // Header Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('STATE OF GREENLAND', CARD_WIDTH / 2, 35);

        ctx.fillStyle = '#3b82f6'; // Liberation Blue
        ctx.font = 'bold 16px "Inter", sans-serif';
        ctx.letterSpacing = '2px';
        ctx.fillText('PROVISIONAL DRIVER LICENSE', CARD_WIDTH / 2, 60);

        // User Photo Placeholder (Polar Bear Silhouette)
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(40, 100, 150, 180);
        ctx.strokeStyle = '#475569';
        ctx.strokeRect(40, 100, 150, 180);

        // "Photo not found" text
        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('NO IMAGE', 40 + 75, 100 + 90);

        // User Details
        ctx.textAlign = 'left';
        ctx.fillStyle = '#0f172a'; // Slate 900

        // Label: Name
        ctx.font = '12px "Inter", sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('NAME', 220, 120);

        // Value: Name
        ctx.font = 'bold 28px "IBM Plex Mono", monospace';
        ctx.fillStyle = '#0f172a';
        ctx.fillText(name.toUpperCase() || 'VOID PROTOTYPE', 220, 150);

        // Label: ID No
        ctx.font = '12px "Inter", sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('ID NUMBER', 220, 190);

        // Value: ID No (Random)
        ctx.font = '18px "IBM Plex Mono", monospace';
        ctx.fillStyle = '#0f172a';
        ctx.fillText(`GR-${Math.floor(Math.random() * 99999999)}`, 220, 215);

        // Label: EXP
        ctx.font = '12px "Inter", sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('EXPIRATION', 220, 250);

        // Value: EXP
        ctx.font = '18px "IBM Plex Mono", monospace';
        ctx.fillStyle = '#0f172a';
        ctx.fillText('07/04/2030', 220, 275);

        // QR Code
        try {
            const qrDataUrl = await QRCode.toDataURL('https://project51.pages.dev');
            const qrImage = new Image();
            qrImage.src = qrDataUrl;
            qrImage.onload = () => {
                ctx.drawImage(qrImage, 480, 250, 100, 100);
                setLoading(false);
                setGenerated(true);
            };
        } catch (err) {
            console.error(err);
            setLoading(false);
        }

        // Footer Warning
        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#ef4444'; // Red-500
        ctx.textAlign = 'center';
        ctx.fillText('NOT FOR OFFICIAL TRAVEL. VALID IN METAVERSE ONLY.', CARD_WIDTH / 2, CARD_HEIGHT - 20);
    };

    useEffect(() => {
        // Initial draw to clear/setup
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#f8fafc';
                ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
                ctx.font = '14px sans-serif';
                ctx.fillStyle = '#94a3b8';
                ctx.textAlign = 'center';
                ctx.fillText('ID Preview will appear here', CARD_WIDTH / 2, CARD_HEIGHT / 2);
            }
        }
    }, []);

    const handleGenerate = () => {
        if (!name.trim()) return;
        drawCard();
    };

    const handleDownload = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `Greenland_ID_${name.replace(/\s+/g, '_')}.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">Applicant Details</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-liberation-blue focus:ring-1 focus:ring-liberation-blue outline-none"
                            placeholder="e.g. John Doe"
                            maxLength={20}
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        className="w-full py-3 bg-liberation-blue hover:bg-blue-600 text-white font-bold rounded transition-colors"
                    >
                        Generate ID
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-slate-200 rounded-lg overflow-hidden border-4 border-slate-300 shadow-xl">
                    <canvas
                        ref={canvasRef}
                        width={600}
                        height={380}
                        className="w-full h-auto block"
                    />
                </div>
                {generated && (
                    <button
                        onClick={handleDownload}
                        className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Download Digital License
                    </button>
                )}
            </div>
        </div>
    );
};

export default IdGenerator;
