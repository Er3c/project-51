import React, { useState } from 'react';

const AssetCalculator = () => {
    const [salary, setSalary] = useState('');
    const [assets, setAssets] = useState('');
    const [result, setResult] = useState<number | null>(null);

    const calculate = () => {
        const s = parseFloat(salary) || 0;
        const a = parseFloat(assets) || 0;

        // Satirical formula:
        // (Salary * 3.5 "Freedom Factor") + (Assets * 1.5 "Rare Earth Mineral Adjustment") + 50000 "Signing Bonus"
        const total = (s * 3.5) + (a * 1.5) + 50000;
        setResult(total);
    };

    return (
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 h-full flex flex-col">
            <div className="h-12 w-12 bg-green-500/20 text-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Asset Re-evaluation</h3>
            <p className="text-sm text-slate-500 mb-6">
                See what you're worth under the new administration.
            </p>

            {!result ? (
                <div className="space-y-4 flex-grow">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Current Annual Income ($)</label>
                        <input
                            type="number"
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Total Assets ($)</label>
                        <input
                            type="number"
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                            value={assets}
                            onChange={(e) => setAssets(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={calculate}
                        className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition-colors"
                    >
                        Calculate Future Value
                    </button>
                </div>
            ) : (
                <div className="flex-grow flex flex-col justify-center animate-in zoom-in duration-300">
                    <p className="text-slate-400 text-sm mb-2 uppercase tracking-widest">Projected Net Worth</p>
                    <p className="text-4xl font-mono font-bold text-green-400 mb-4">
                        ${result.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </p>
                    <div className="bg-green-900/30 p-3 rounded border border-green-800 mb-6">
                        <p className="text-xs text-green-300">
                            Includes adjustment for rare earth mineral proximity and strategic location bonuses.
                        </p>
                    </div>
                    <button
                        onClick={() => setResult(null)}
                        className="text-slate-500 text-sm hover:text-white underline"
                    >
                        Recalculate
                    </button>
                </div>
            )}
        </div>
    );
};

export default AssetCalculator;
