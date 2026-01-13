import React, { useRef, useState } from 'react';

const IdGenerator = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [userImage, setUserImage] = useState<string | null>(null);

    // Constants for card design
    const CARD_WIDTH = 600;
    const CARD_HEIGHT = 380;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setUserImage(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

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

        // User Photo
        if (userImage) {
            const img = new Image();
            img.src = userImage;
            await new Promise((resolve) => {
                img.onload = () => {
                    // Aspect ratio preserving crop/fill (simplistic center crop)
                    const aspect = img.width / img.height;
                    const targetAspect = 150 / 180;
                    let drawWidth, drawHeight, offsetX, offsetY;

                    if (aspect > targetAspect) {
                        // Image is wider than target
                        drawHeight = 180;
                        drawWidth = 180 * aspect;
                        offsetX = 40 - (drawWidth - 150) / 2;
                        offsetY = 100;
                    } else {
                        // Image is taller than target
                        drawWidth = 150;
                        drawHeight = 150 / aspect;
                        offsetX = 40;
                        offsetY = 100 - (drawHeight - 180) / 2;
                    }

                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(40, 100, 150, 180);
                    ctx.clip();
                    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                    ctx.restore();

                    ctx.strokeStyle = '#475569';
                    ctx.strokeRect(40, 100, 150, 180);
                    resolve(null);
                };
                img.onerror = () => resolve(null); // Continue if image fails
            });
        } else {
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
        }

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
            // Dynamic import to prevent hydration issues
            const QRCode = (await import('qrcode')).default;
            const qrDataUrl = await QRCode.toDataURL('https://project51.pages.dev');

            await new Promise((resolve) => {
                const qrImage = new Image();
                qrImage.src = qrDataUrl;
                qrImage.onload = () => {
                    ctx.drawImage(qrImage, 480, 250, 100, 100);
                    resolve(null);
                };
                qrImage.onerror = () => {
                    console.error("QR Image failed to load");
                    resolve(null); // Continue anyway
                };
            });
        } catch (err) {
            console.error(err);
        }

        // Footer Warning
        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#ef4444'; // Red-500
        ctx.textAlign = 'center';
        ctx.fillText('NOT FOR OFFICIAL TRAVEL. VALID IN METAVERSE ONLY.', CARD_WIDTH / 2, CARD_HEIGHT - 20);

        setLoading(false);
        setGenerated(true);
    };

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
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 h-full flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white mb-6 text-center">Applicant Details</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2 text-center">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-liberation-blue focus:ring-1 focus:ring-liberation-blue outline-none text-center"
                                placeholder="e.g. John Doe"
                                maxLength={20}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2 text-center">Photo (Optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={!name.trim() || loading}
                        className="w-full py-4 bg-liberation-blue hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold rounded transition-colors"
                    >
                        {loading ? 'Processing...' : 'Generate ID'}
                    </button>
                </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="bg-slate-200 rounded-lg overflow-hidden border-4 border-slate-300 shadow-xl mb-6 max-w-full">
                    <canvas
                        ref={canvasRef}
                        width={600}
                        height={380}
                        className="w-full h-auto block"
                        style={{ maxWidth: '100%' }}
                    />
                </div>
                {generated ? (
                    <button
                        onClick={handleDownload}
                        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Download Digital License
                    </button>
                ) : (
                    <div className="w-full py-4 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center text-slate-500 text-sm">
                        Preview will appear here
                    </div>
                )}
            </div>
        </div>
    );
};

export default IdGenerator;
