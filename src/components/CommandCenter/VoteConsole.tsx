import React, { useState } from 'react';

interface VoteConsoleProps {
    userLocation: string;
}

const VoteConsole = ({ userLocation }: VoteConsoleProps) => {

    const [hasVoted, setHasVoted] = useState<'yes' | 'no' | null>(null);
    const [isSending, setIsSending] = useState(false);

    const handleVote = (type: 'yes' | 'no') => {
        setIsSending(true);
        // Simulate network request
        setTimeout(() => {
            setHasVoted(type);
            setIsSending(false);
        }, 800);
    };

    if (hasVoted) {
        return (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-md mx-auto shadow-2xl text-center animate-in fade-in zoom-in duration-300">
                <div className={`text-5xl mb-4 ${hasVoted === 'yes' ? 'text-green-500' : 'text-red-500'}`}>
                    {hasVoted === 'yes' ? '✓' : '✖'}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Vote Registered</h3>
                <p className="text-slate-400 text-sm">
                    {hasVoted === 'yes'
                        ? `Your support from ${userLocation} has been logged.`
                        : `Dissent recorded from ${userLocation}.`}
                </p>
                <button
                    onClick={() => setHasVoted(null)}
                    className="mt-6 text-xs text-slate-500 hover:text-white underline"
                >
                    Vote again (Dev Mode)
                </button>
            </div>
        );
    }

    return (
        <div className="bg-slate-950/90 backdrop-blur border border-slate-800 rounded-xl p-6 shadow-2xl max-w-lg mx-auto transform transition-all hover:scale-[1.01]">
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <div>
                    <h3 className="text-white font-mono font-bold uppercase tracking-widest text-sm">Command Uplink</h3>
                    <p className="text-slate-400 text-xs font-mono mt-1">
                        <span className="text-slate-500">DETECTED ORIGIN:</span> <span className="text-white font-bold">{userLocation.toUpperCase()}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-green-500 font-mono">SIGNAL STRONG</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    disabled={isSending}
                    onClick={() => handleVote('yes')}
                    className="group relative flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-liberation-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🇺🇸</span>
                    <span className="text-white font-bold tracking-wider group-hover:text-liberation-blue">AUTHORIZE</span>
                    <span className="text-[10px] text-slate-500 mt-2 uppercase">Support Annexation</span>

                    {/* Corner accents */}
                    <span className="absolute top-2 left-2 w-2 h-2 border-t border-l border-slate-600 group-hover:border-liberation-blue"></span>
                    <span className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-slate-600 group-hover:border-liberation-blue"></span>
                </button>

                <button
                    disabled={isSending}
                    onClick={() => handleVote('no')}
                    className="group relative flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🇩🇰</span>
                    <span className="text-white font-bold tracking-wider group-hover:text-red-500">VETO</span>
                    <span className="text-[10px] text-slate-500 mt-2 uppercase">Reject Sovereignty</span>

                    {/* Corner accents */}
                    <span className="absolute top-2 left-2 w-2 h-2 border-t border-l border-slate-600 group-hover:border-red-500"></span>
                    <span className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-slate-600 group-hover:border-red-500"></span>
                </button>
            </div>
        </div>
    );
};

export default VoteConsole;
