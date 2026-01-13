import { useState } from 'react';

const AssetCalculator = () => {
    const [salary, setSalary] = useState('');
    const [assets, setAssets] = useState('');
    const [savings, setSavings] = useState('');
    const [result, setResult] = useState<number | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const calculate = () => {
        const s = parseFloat(salary) || 0;
        const a = parseFloat(assets) || 0;
        const sv = parseFloat(savings) || 0;

        // Updated formula with more factors
        const salaryBonus = s * 3.5; // Freedom Factor
        const assetBonus = a * 1.5; // Rare Earth Adjustment
        const savingsBonus = sv * 2.0; //  Currency Strength Bonus
        const signingBonus = 50000; // Welcome Bonus

        const total = salaryBonus + assetBonus + savingsBonus + signingBonus;
        setResult(total);
        setShowDetails(true);
    };

    const reset = () => {
        setResult(null);
        setShowDetails(false);
    };

    const breakdown = result ? {
        salary: {
            label: 'Annual Income Adjustment',
            value: (parseFloat(salary) || 0) * 3.5,
            multiplier: '× 3.5 Freedom Factor'
        },
        assets: {
            label: 'Asset Revaluation',
            value: (parseFloat(assets) || 0) * 1.5,
            multiplier: '× 1.5 Mineral Proximity Bonus'
        },
        savings: {
            label: 'Savings Enhancement',
            value: (parseFloat(savings) || 0) * 2.0,
            multiplier: '× 2.0 Currency Strength'
        },
        bonus: {
            label: 'Integration Signing Bonus',
            value: 50000,
            multiplier: 'One-time payment'
        }
    } : null;

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden max-w-2xl mx-auto">
            {!result ? (
                <div className="p-5 space-y-5">
                    {/* Header */}
                    <div className="text-center pb-4 border-b border-slate-700">
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Economic Integration Calculator</h3>
                        <p className="text-sm text-slate-400">
                            Estimate your financial status under the new economic zone
                        </p>
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Annual Income
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                <input
                                    type="number"
                                    value={salary}
                                    onChange={(e) => setSalary(e.target.value)}
                                    className="w-full bg-slate-900/60 border-2 border-slate-700 rounded-lg pl-8 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                    placeholder="75,000"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                </svg>
                                Real Estate & Property
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                <input
                                    type="number"
                                    value={assets}
                                    onChange={(e) => setAssets(e.target.value)}
                                    className="w-full bg-slate-900/60 border-2 border-slate-700 rounded-lg pl-8 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                    placeholder="250,000"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                                Savings & Investments
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                <input
                                    type="number"
                                    value={savings}
                                    onChange={(e) => setSavings(e.target.value)}
                                    className="w-full bg-slate-900/60 border-2 border-slate-700 rounded-lg pl-8 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                    placeholder="100,000"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Calculate Button */}
                    <button
                        onClick={calculate}
                        disabled={!salary && !assets && !savings}
                        className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 disabled:from-slate-700 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-green-900/30 transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                        Calculate Future Value
                    </button>
                </div>
            ) : (
                <div className="p-5 space-y-5">
                    {/* Result Display */}
                    <div className="text-center pb-5 border-b border-slate-700">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Projected Net Worth</p>
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-green-500/20 blur-xl"></div>
                            <p className="relative text-4xl font-mono font-black text-green-400 mb-2">
                                ${result.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                            </p>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Under the new economic framework</p>
                    </div>

                    {/* Breakdown */}
                    {showDetails && breakdown && (
                        <div className="space-y-2.5">
                            <h4 className="text-sm font-semibold text-slate-300 mb-2.5 flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                                Breakdown
                            </h4>
                            {Object.entries(breakdown).map(([key, item]) => (
                                item.value > 0 && (
                                    <div key={key} className="bg-slate-900/40 border border-slate-700 rounded-lg p-3">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-sm text-slate-300">{item.label}</span>
                                            <span className="text-sm font-bold text-green-400">
                                                +${item.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">{item.multiplier}</p>
                                    </div>
                                )
                            ))}
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3">
                        <p className="text-xs text-green-300 leading-relaxed">
                            <strong>Note:</strong> This calculation includes adjustments for rare earth mineral proximity, strategic location bonuses, and integration benefits under the proposed economic framework.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={reset}
                            className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
                        >
                            Recalculate
                        </button>
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="flex-1 py-2.5 border-2 border-slate-700 hover:border-slate-600 text-slate-300 font-semibold rounded-lg transition-all"
                        >
                            {showDetails ? 'Hide' : 'Show'} Details
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssetCalculator;
