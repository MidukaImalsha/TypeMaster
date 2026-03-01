import React, { useMemo } from "react";
import { Trophy, Medal, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface PlayerResult {
  playerName: string;
  rawWPM: number;
  correctWPM: number;
  accuracy: number;
}

interface MultiPlayerEndScreenProps {
  gameId: string;
  results: PlayerResult[];
}

const MultiPlayerEndScreen: React.FC<MultiPlayerEndScreenProps> = ({ gameId, results }) => {
  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => {
      if (b.correctWPM !== a.correctWPM) return b.correctWPM - a.correctWPM;
      return b.accuracy - a.accuracy;
    });
  }, [results]);

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />;
      case 1:
        return <Medal className="h-6 w-6 text-slate-300 drop-shadow-[0_0_6px_rgba(203,213,225,0.4)]" />;
      case 2:
        return <Award className="h-6 w-6 text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" />;
      default:
        return null;
    }
  };

  const rowBg = (index: number) => {
    if (index === 0) return "bg-yellow-500/8 border-yellow-500/25";
    if (index === 1) return "bg-slate-400/8 border-slate-400/20";
    if (index === 2) return "bg-amber-500/8 border-amber-500/20";
    return "bg-blue-900/15 border-blue-800/20";
  };

  return (
    <div className="fadein mx-auto max-w-4xl mt-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-2xl border border-blue-800/40 bg-[rgba(5,15,45,0.8)] backdrop-blur-xl shadow-[0_0_40px_rgba(37,99,235,0.12)]"
      >
        {/* Header */}
        <div className="border-b border-blue-800/40 bg-gradient-to-r from-blue-900/50 to-blue-800/30 px-6 py-5 text-center">
          <motion.h2
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-3xl font-black tracking-tight bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent"
          >
            Game Results
          </motion.h2>
          <motion.p
            initial={{ y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-1.5 text-sm text-blue-300/50"
          >
            Game ID:{" "}
            <span className="rounded-md border border-blue-700/50 bg-blue-900/50 px-2 py-0.5 font-mono text-blue-300">
              {gameId}
            </span>
          </motion.p>
        </div>

        {/* Table */}
        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="pb-3 pl-3 text-[11px] uppercase tracking-widest text-blue-400/50 font-semibold">Rank</th>
                  <th className="pb-3 text-[11px] uppercase tracking-widest text-blue-400/50 font-semibold">Player</th>
                  <th className="pb-3 text-right text-[11px] uppercase tracking-widest text-blue-400/50 font-semibold">Correct WPM</th>
                  <th className="pb-3 text-right text-[11px] uppercase tracking-widest text-blue-400/50 font-semibold">Raw WPM</th>
                  <th className="pb-3 pr-3 text-right text-[11px] uppercase tracking-widest text-blue-400/50 font-semibold">Accuracy</th>
                </tr>
              </thead>
              <AnimatePresence>
                <motion.tbody className="space-y-2">
                  {sortedResults.map((result, index) => (
                    <motion.tr
                      key={result.playerName}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
                      className={`rounded-xl border ${rowBg(index)}`}
                    >
                      <td className="rounded-l-xl py-3 pl-3">
                        <div className="flex items-center gap-2">
                          {getPositionIcon(index)}
                          <span className="font-bold text-blue-200">{index + 1}</span>
                        </div>
                      </td>
                      <td className="py-3 font-semibold text-blue-100">{result.playerName}</td>
                      <td className="py-3 text-right font-black text-blue-400 text-base">{result.correctWPM}</td>
                      <td className="py-3 text-right text-blue-300/70">{result.rawWPM}</td>
                      <td className="rounded-r-xl py-3 pr-3 text-right">
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
                          className={`inline-block rounded-lg px-2.5 py-1 text-xs font-bold ${result.accuracy >= 90
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : result.accuracy >= 70
                                ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                                : "bg-red-500/15 text-red-400 border border-red-500/30"
                            }`}
                        >
                          {result.accuracy.toFixed(1)}%
                        </motion.span>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </AnimatePresence>
            </table>
          </div>
        </div>
      </motion.div>

      <div className="mt-5 flex justify-center">
        <button
          className="btn-primary gap-2"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4" />
          Play Again
        </button>
      </div>
    </div>
  );
};

export default MultiPlayerEndScreen;
