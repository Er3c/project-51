import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { voteTrigger } from '../../stores/voteStore';
import MapChart from './Map';
import VoteConsole from './VoteConsole';
import { iso2ToNumeric } from '../../utils/countryMapping';



const CommandCenter = () => {
    const [voteData, setVoteData] = useState<Record<string, { yes: number; no: number }>>({});
    // Default fallback, but we'll try to fetch it or let the backend handle it.
    // For visual display, we can use "Unknown" or fetch from a service if needed.
    // For now let's just use a placeholder that the component expects.
    const [userLocation, setUserLocation] = useState("Unknown Origin");
    const [userCountryCode, setUserCountryCode] = useState("XX");
    const [initialHasVoted, setInitialHasVoted] = useState(false);
    const [initialVoteType, setInitialVoteType] = useState<'yes' | 'no' | null>(null);

    // Subscribe to trigger
    const trigger = useStore(voteTrigger);

    // Stable fetch function with cache busting
    const fetchStats = async () => {
        try {
            // Append timestamp to prevent aggressive caching
            const res = await fetch(`/api/stats?t=${Date.now()}`);
            if (res.ok) {
                const rawData = await res.json() as Record<string, { yes: number; no: number }>;
                const mappedData: Record<string, { yes: number; no: number }> = {};
                Object.entries(rawData).forEach(([iso2, counts]) => {
                    const numericId = iso2ToNumeric[iso2];
                    if (numericId) {
                        mappedData[numericId] = counts;
                    }
                });
                setVoteData(mappedData);
            }
        } catch (e) {
            console.error("Failed to fetch stats", e);
        }
    };

    // Re-fetch when trigger changes
    useEffect(() => {
        if (trigger > 0) {
            fetchStats();
        }
    }, [trigger]);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                // Add timestamp to force fresh fetch and bypass browser cache
                const res = await fetch(`/api/me?t=${Date.now()}`);
                if (res.ok) {
                    const data = await res.json() as {
                        country: string;
                        city?: string;
                        display?: string;
                        hasVoted?: boolean;
                        voteType?: 'yes' | 'no' | null
                    };

                    setUserLocation(data.country === "XX" ? "Unknown Origin" : data.display || data.country);
                    setUserCountryCode(data.country);
                    if (data.hasVoted) {
                        setInitialHasVoted(true);
                        setInitialVoteType(data.voteType || null);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch location", e);
            }
        }

        fetchLocation();
        fetchStats();

        // Refresh every 10 seconds
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    // ... (rest of the component)

    // Optimistic Update Helper Removed - we use store trigger now.

    // ... (inside return)
    // Replace the VoteConsole props
    <VoteConsole
        userLocation={userLocation}
        countryCode={userCountryCode}
    />

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
            {/* Global Stats - Mobile: above map, Desktop: overlay on map */}
            <div className="md:hidden mb-4">
                <div className="bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-2xl">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Global Consensus</h3>
                    {(() => {
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
            </div>

            {/* Map Layer */}
            <div className="w-full min-h-[500px] aspect-[3/4] md:aspect-[2/1] lg:h-[600px] mb-8 relative">
                {/* Global Status Overlay - Desktop only */}
                <div className="hidden md:block absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-2xl max-w-xs transition-all hover:scale-105">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Global Consensus</h3>

                    {(() => {
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
                    <div className="absolute top-4 left-4 right-4 md:left-auto md:right-4 z-30 md:w-64 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-2xl animate-in slide-in-from-right duration-300">
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
            <div className="relative z-20 -mt-20 md:-mt-32 px-4 pointer-events-none">
                <div className="pointer-events-auto w-full max-w-lg mx-auto">
                    <VoteConsole
                        userLocation={userLocation}
                        countryCode={userCountryCode}
                        initialHasVoted={initialHasVoted}
                        initialVoteType={initialVoteType}
                    />
                </div>
            </div>



            {/* Tutorial */}
            <div className="text-center mt-8 text-slate-500 text-sm">
                <p>Global data is live. Click territory to inspect regional consensus.</p>
            </div>
        </div>
    );
};

export default CommandCenter;
