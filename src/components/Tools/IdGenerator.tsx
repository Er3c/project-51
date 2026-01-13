import React, { useRef, useState } from 'react';

const IdGenerator = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('M');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [userImage, setUserImage] = useState<string | null>(null);

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

        // Background - Blue gradient inspired by Arctic sky
        const gradient = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
        gradient.addColorStop(0, '#1e3a8a'); // Deep blue
        gradient.addColorStop(0.5, '#3b82f6'); // Liberation blue
        gradient.addColorStop(1, '#60a5fa'); // Light blue
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

        // Decorative iceberg pattern (bottom)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.moveTo(0, CARD_HEIGHT - 80);
        ctx.lineTo(100, CARD_HEIGHT - 120);
        ctx.lineTo(180, CARD_HEIGHT - 100);
        ctx.lineTo(250, CARD_HEIGHT - 140);
        ctx.lineTo(350, CARD_HEIGHT - 110);
        ctx.lineTo(450, CARD_HEIGHT - 130);
        ctx.lineTo(CARD_WIDTH, CARD_HEIGHT - 100);
        ctx.lineTo(CARD_WIDTH, CARD_HEIGHT);
        ctx.lineTo(0, CARD_HEIGHT);
        ctx.closePath();
        ctx.fill();

        // Stars pattern (representing US flag)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        const stars = [
            [50, 30], [80, 25], [110, 35], [140, 28], [170, 32],
            [65, 50], [95, 45], [125, 52], [155, 48]
        ];
        stars.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        });

        // Header section
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(0, 0, CARD_WIDTH, 70);

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px "Arial", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('GREENLAND', 30, 35);

        ctx.fillStyle = '#fbbf24'; // Gold color
        ctx.font = 'bold 18px "Arial", sans-serif';
        ctx.fillText('51st STATE', 30, 55);

        // Right side header - ID CARD
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px "Arial", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('ID CARD', CARD_WIDTH - 30, 45);

        // White info section
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(30, 90, CARD_WIDTH - 60, 230);

        // Photo frame
        const photoX = 45;
        const photoY = 105;
        const photoW = 140;
        const photoH = 170;

        if (userImage) {
            const img = new Image();
            img.src = userImage;
            await new Promise((resolve) => {
                img.onload = () => {
                    const aspect = img.width / img.height;
                    const targetAspect = photoW / photoH;
                    let drawWidth, drawHeight, offsetX, offsetY;

                    if (aspect > targetAspect) {
                        drawHeight = photoH;
                        drawWidth = photoH * aspect;
                        offsetX = photoX - (drawWidth - photoW) / 2;
                        offsetY = photoY;
                    } else {
                        drawWidth = photoW;
                        drawHeight = photoW / aspect;
                        offsetX = photoX;
                        offsetY = photoY - (drawHeight - photoH) / 2;
                    }

                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(photoX, photoY, photoW, photoH);
                    ctx.clip();
                    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                    ctx.restore();

                    // Photo border
                    ctx.strokeStyle = '#cbd5e1';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(photoX, photoY, photoW, photoH);
                    resolve(null);
                };
                img.onerror = () => resolve(null);
            });
        } else {
            // Placeholder
            ctx.fillStyle = '#f1f5f9';
            ctx.fillRect(photoX, photoY, photoW, photoH);
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2;
            ctx.strokeRect(photoX, photoY, photoW, photoH);

            // Silhouette icon
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('PHOTO', photoX + photoW / 2, photoY + photoH / 2);
        }

        // Information section
        const infoX = 210;
        let infoY = 115;

        // Full Name
        ctx.fillStyle = '#64748b';
        ctx.font = '10px "Arial", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('FULL NAME', infoX, infoY);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 18px "Arial", sans-serif';
        const displayName = name.toUpperCase() || 'JOHN DOE';
        ctx.fillText(displayName.length > 20 ? displayName.substring(0, 20) + '...' : displayName, infoX, infoY + 18);

        // Date of Birth & Gender (same line)
        infoY += 42;
        ctx.fillStyle = '#64748b';
        ctx.font = '10px "Arial", sans-serif';
        ctx.fillText('DOB', infoX, infoY);
        ctx.fillText('SEX', infoX + 120, infoY);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 13px "Arial", sans-serif';
        // Format DOB from YYYY-MM-DD to MM/DD/YYYY
        const formattedDob = dob ? new Date(dob).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : '01/01/2000';
        ctx.fillText(formattedDob, infoX, infoY + 16);
        ctx.fillText(gender, infoX + 120, infoY + 16);

        // ID Number
        infoY += 40;
        ctx.fillStyle = '#64748b';
        ctx.font = '10px "Arial", sans-serif';
        ctx.fillText('ID NUMBER', infoX, infoY);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 14px "Courier New", monospace';
        const idNum = `GL-${Math.floor(Math.random() * 99999999).toString().padStart(8, '0')}`;
        ctx.fillText(idNum, infoX, infoY + 16);

        // Address
        infoY += 38;
        ctx.fillStyle = '#64748b';
        ctx.font = '10px "Arial", sans-serif';
        ctx.fillText('ADDRESS', infoX, infoY);

        ctx.fillStyle = '#0f172a';
        ctx.font = '12px "Arial", sans-serif';
        const displayAddress = address || 'Nuuk, Greenland';
        // Split address if too long
        if (displayAddress.length > 28) {
            ctx.fillText(displayAddress.substring(0, 28), infoX, infoY + 15);
            ctx.fillText(displayAddress.substring(28, 56), infoX, infoY + 28);
        } else {
            ctx.fillText(displayAddress, infoX, infoY + 15);
        }

        // Issue Date & Expiration
        infoY += 48;
        ctx.fillStyle = '#64748b';
        ctx.font = '10px "Arial", sans-serif';
        ctx.fillText('ISSUED', infoX, infoY);
        ctx.fillText('EXPIRES', infoX + 120, infoY);

        const issueDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        ctx.fillStyle = '#0f172a';
        ctx.font = '12px "Arial", sans-serif';
        ctx.fillText(issueDate, infoX, infoY + 15);
        ctx.fillText('12/31/2030', infoX + 120, infoY + 15);

        // QR Code
        try {
            const QRCode = (await import('qrcode')).default;
            const qrData = `GL-ID:${idNum}:${name}`;
            const qrDataUrl = await QRCode.toDataURL(qrData, {
                width: 90,
                margin: 1,
                color: { dark: '#1e293b', light: '#ffffff' }
            });

            await new Promise((resolve) => {
                const qrImage = new Image();
                qrImage.src = qrDataUrl;
                qrImage.onload = () => {
                    ctx.drawImage(qrImage, 470, 225, 90, 90);
                    resolve(null);
                };
                qrImage.onerror = () => resolve(null);
            });
        } catch (err) {
            console.error(err);
        }

        // Bottom text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px "Arial", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PROVISIONAL IDENTIFICATION CARD', CARD_WIDTH / 2, CARD_HEIGHT - 40);

        ctx.font = '9px "Arial", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText('Valid for transitional period only • Not for federal identification', CARD_WIDTH / 2, CARD_HEIGHT - 20);

        setLoading(false);
        setGenerated(true);
    };

    const handleGenerate = async () => {
        if (!name.trim()) return;
        setGenerated(true); // 先显示 canvas
        // 等待一帧确保 DOM 更新
        await new Promise(resolve => requestAnimationFrame(resolve));
        await drawCard();
    };

    const handleDownload = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `Greenland_ID_${name.replace(/\\s+/g, '_')}.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* Input Form */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-5">
                {/* Name Input */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                        <svg className="w-4 h-4 text-liberation-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        Full Name
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-900/60 border-2 border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:border-liberation-blue focus:ring-2 focus:ring-liberation-blue/20 outline-none transition-all"
                            placeholder="Enter your full name"
                            maxLength={20}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                            {name.length}/20
                        </div>
                    </div>
                </div>

                {/* Date of Birth & Gender */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                            <svg className="w-4 h-4 text-liberation-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            Date of Birth
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                type="text"
                                placeholder="YYYY"
                                maxLength={4}
                                value={dob.split('-')[0] || ''}
                                onChange={(e) => {
                                    const year = e.target.value.replace(/\D/g, '');
                                    const [, month = '', day = ''] = dob.split('-');
                                    setDob(year ? `${year}-${month}-${day}` : '');
                                }}
                                className="w-full bg-slate-900/60 border-2 border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 text-center focus:border-liberation-blue focus:ring-2 focus:ring-liberation-blue/20 outline-none transition-all"
                            />
                            <input
                                type="text"
                                placeholder="MM"
                                maxLength={2}
                                value={dob.split('-')[1] || ''}
                                onChange={(e) => {
                                    const month = e.target.value.replace(/\D/g, '').slice(0, 2);
                                    const num = parseInt(month);
                                    if (month === '' || (num >= 1 && num <= 12)) {
                                        const [year = '', , day = ''] = dob.split('-');
                                        setDob(year || month || day ? `${year}-${month}-${day}` : '');
                                    }
                                }}
                                onBlur={(e) => {
                                    const month = e.target.value;
                                    if (month && month.length === 1) {
                                        const [year = '', , day = ''] = dob.split('-');
                                        setDob(`${year}-${month.padStart(2, '0')}-${day}`);
                                    }
                                }}
                                className="w-full bg-slate-900/60 border-2 border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 text-center focus:border-liberation-blue focus:ring-2 focus:ring-liberation-blue/20 outline-none transition-all"
                            />
                            <input
                                type="text"
                                placeholder="DD"
                                maxLength={2}
                                value={dob.split('-')[2] || ''}
                                onChange={(e) => {
                                    const day = e.target.value.replace(/\D/g, '').slice(0, 2);
                                    const num = parseInt(day);
                                    if (day === '' || (num >= 1 && num <= 31)) {
                                        const [year = '', month = ''] = dob.split('-');
                                        setDob(year || month || day ? `${year}-${month}-${day}` : '');
                                    }
                                }}
                                onBlur={(e) => {
                                    const day = e.target.value;
                                    if (day && day.length === 1) {
                                        const [year = '', month = ''] = dob.split('-');
                                        setDob(`${year}-${month}-${day.padStart(2, '0')}`);
                                    }
                                }}
                                className="w-full bg-slate-900/60 border-2 border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 text-center focus:border-liberation-blue focus:ring-2 focus:ring-liberation-blue/20 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                            <svg className="w-4 h-4 text-liberation-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                            </svg>
                            Gender
                        </label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full bg-slate-900/60 border-2 border-slate-700 rounded-lg pl-4 pr-10 py-2.5 text-white focus:border-liberation-blue focus:ring-2 focus:ring-liberation-blue/20 outline-none transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDZMMTEgMSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat"
                        >
                            <option value="M">Male (M)</option>
                            <option value="F">Female (F)</option>
                            <option value="X">Non-binary (X)</option>
                            <option value="NB">Gender Diverse (NB)</option>
                            <option value="O">Other (O)</option>
                        </select>
                    </div>
                </div>

                {/* Address */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                        <svg className="w-4 h-4 text-liberation-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        Address
                    </label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-slate-900/60 border-2 border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:border-liberation-blue focus:ring-2 focus:ring-liberation-blue/20 outline-none transition-all"
                        placeholder="City, Greenland"
                        maxLength={60}
                    />
                </div>

                {/* Photo Upload */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                        <svg className="w-4 h-4 text-liberation-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Photo Upload
                        <span className="text-xs text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            id="photo-upload"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <label
                            htmlFor="photo-upload"
                            className="w-full flex items-center justify-center gap-2 bg-slate-900/60 border-2 border-dashed border-slate-700 rounded-lg p-3 hover:border-liberation-blue/50 transition-all cursor-pointer group"
                        >
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-liberation-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                            </svg>
                            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                                {userImage ? 'Change Photo' : 'Choose Photo'}
                            </span>
                        </label>
                    </div>
                    {userImage && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-green-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Photo uploaded successfully
                        </div>
                    )}
                </div>

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    disabled={!name.trim() || loading}
                    className="w-full py-3 bg-gradient-to-r from-liberation-blue to-blue-500 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-liberation-blue/30 transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                            Generate Digital ID
                        </>
                    )}
                </button>
            </div>

            {/* Preview Card */}
            {generated && (
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
                    <div className="transition-all duration-300">
                        <div className="bg-slate-200 rounded-lg overflow-hidden border-4 border-slate-300 shadow-2xl mb-5">
                            <canvas
                                ref={canvasRef}
                                width={CARD_WIDTH}
                                height={CARD_HEIGHT}
                                className="w-full h-auto"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleDownload}
                        className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-green-900/30 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                        Download Digital License
                    </button>
                </div>
            )}

            {/* Hidden canvas for initial render */}
            {!generated && (
                <canvas
                    ref={canvasRef}
                    width={CARD_WIDTH}
                    height={CARD_HEIGHT}
                    className="hidden"
                />
            )}
        </div>
    );
};

export default IdGenerator;
