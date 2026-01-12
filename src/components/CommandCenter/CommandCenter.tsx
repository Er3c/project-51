import React, { useState, useEffect } from 'react';
import MapChart from './Map';
import VoteConsole from './VoteConsole';

// Helper to generate fake data for visualization
const generateGlobalVotes = () => {
    const data: Record<string, { yes: number; no: number }> = {};
    // Common ISO numeric codes
    // 840: USA, 156: China, 208: Denmark, 304: Greenland, 643: Russia, 826: UK
    // Let's populate random data for a bunch of IDs
    const popularIds = ['840', '156', '208', '304', '643', '826', '250', '276', '356', '392', '036'];

    popularIds.forEach(id => {
        const isPro = Math.random() > 0.4; // Slight bias
        const total = 1000 + Math.floor(Math.random() * 90000);
        const split = 0.5 + (Math.random() * 0.4 * (isPro ? 1 : -1)); // 50-90% split
        data[id] = {
            yes: Math.floor(total * split),
            no: Math.floor(total * (1 - split))
        };
    });

    // Hardcode USA to be YES
    data['840'] = { yes: 950000, no: 12000 };
    // Hardcode Denmark to be NO
    data['208'] = { yes: 10, no: 500000 };

    return data;
};

const CommandCenter = () => {
    const [voteData] = useState(generateGlobalVotes());
    const [userLocation] = useState("Beijing, CN"); // Simulated IP Location

    // Inspection State
    const [inspectedCountry, setInspectedCountry] = useState<{ name: string, id: string } | null>(null);

    const handleCountrySelect = (name: string, id: string) => {
        setInspectedCountry({ name, id });
    };

    const getStats = (id: string) => {
        return voteData[id] || { yes: 0, no: 0 };
    };

    const calculatePercentage = (yes: number, no: number) => {
        const total = yes + no;
        if (total === 0) return { yesPct: 0, noPct: 0 };
        return {
            yesPct: Math.round((yes / total) * 100),
            noPct: Math.round((no / total) * 100)
        };
    };

    return (
        <div className="w-full relative">
            {/* Map Layer */}
            <div className="w-full aspect-[4/3] md:aspect-[2/1] lg:h-[600px] mb-8 relative">
                {/* Global Status Overlay */}
                <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-2xl max-w-xs transition-all hover:scale-105">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Global Consensus</h3>

                    {(() => {
                        // Calculate totals
                        let globalYes = 0;
                        let globalNo = 0;
                        Object.values(voteData).forEach(v => {
                            globalYes += v.yes;
                            globalNo += v.no;
                        });
                        const total = globalYes + globalNo;
                        const { yesPct, noPct } = calculatePercentage(globalYes, globalNo);

                        return (
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-3xl font-mono font-bold text-white">{total.toLocaleString()}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Active Participants</p>
                                </div>

                                <div>
                                    <div className="flex justify-between text-[10px] text-slate-400 mb-1 uppercase">
                                        <span>Authorized</span>
                                        <span>Vetoed</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-liberation-blue" style={{ width: `${yesPct}%` }}></div>
                                        <div className="h-full bg-red-600" style={{ width: `${noPct}%` }}></div>
                                    </div>
                                    <div className="flex justify-between text-xs font-mono font-bold mt-1">
                                        <span className="text-liberation-blue">{yesPct}% ({globalYes.toLocaleString()})</span>
                                        <span className="text-red-500">{noPct}% ({globalNo.toLocaleString()})</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>

                <MapChart
                    voteData={voteData}
                    onCountrySelect={handleCountrySelect}
                    selectedCountryId={inspectedCountry?.id}
                />

                {/* Sector Analysis Overlay (Popup) */}
                {inspectedCountry && (
                    <div className="absolute top-4 right-4 z-20 w-64 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-2xl animate-in slide-in-from-right duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-white font-bold text-lg">{inspectedCountry.name}</h3>
                                <p className="text-slate-400 text-xs font-mono uppercase">Sector Analysis</p>
                            </div>
                            <button
                                onClick={() => setInspectedCountry(null)}
                                className="text-slate-500 hover:text-white"
                            >
                                ×
                            </button>
                        </div>

                        {(() => {
                            const stats = getStats(inspectedCountry.id);
                            const { yesPct, noPct } = calculatePercentage(stats.yes, stats.no);
                            const isBlue = stats.yes >= stats.no;

                            return (
                                <div className="space-y-4">
                                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                                        <span>Authorize</span>
                                        <span>Veto</span>
                                    </div>
                                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-liberation-blue transition-all duration-1000" style={{ width: `${yesPct}%` }}></div>
                                        <div className="h-full bg-red-600 transition-all duration-1000" style={{ width: `${noPct}%` }}></div>
                                    </div>
                                    <div className="flex justify-between text-sm font-mono font-bold">
                                        <span className="text-liberation-blue">{yesPct}%</span>
                                        <span className="text-red-500">{noPct}%</span>
                                    </div>

                                    <div className="pt-4 border-t border-slate-700">
                                        <p className="text-xs text-slate-400">Status:</p>
                                        <p className={`font-bold uppercase ${isBlue ? 'text-liberation-blue' : 'text-red-500'}`}>
                                            {isBlue ? 'Acquisition Probable' : 'Hostile Territory'}
                                        </p>
                                        <p className="text-[10px] text-slate-500 mt-1">
                                            Total Votes: {(stats.yes + stats.no).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}
            </div>

            {/* Floating Console Layer */}
            <div className="relative z-20 -mt-20 md:-mt-32 px-4">
                <VoteConsole
                    userLocation={userLocation}
                />
            </div>

            {/* Tutorial */}
            <div className="text-center mt-8 text-slate-500 text-sm">
                <p>Global data is live. Click territory to inspect regional consensus.</p>
            </div>
        </div>
    );
};

export default CommandCenter;
