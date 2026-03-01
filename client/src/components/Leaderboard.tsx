import type React from "react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Medal,
  Award,
  Rocket,
  GraduationCap,
  Briefcase,
  TrendingUp,
  PersonStanding,
} from "lucide-react";
import { useLeaderboard } from "../helpers/useLeaderboard";
import { useLoader } from "../utils/LoaderContext";
import qr from "../assets/qr.jpg";

const Leaderboard: React.FC = () => {
  const { players, averageWPM, loading, totalPlayers, error } = useLeaderboard();
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (loading) showLoader();
    else hideLoader();
  }, [loading, showLoader, hideLoader]);

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="h-7 w-7 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />;
      case 1:
        return <Medal className="h-7 w-7 text-slate-300 drop-shadow-[0_0_6px_rgba(203,213,225,0.5)]" />;
      case 2:
        return <Award className="h-7 w-7 text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" />;
      default:
        return <Rocket className="h-6 w-6 text-blue-400/60" />;
    }
  };

  const rankBgClass = (index: number) => {
    if (index === 0) return "bg-yellow-500/10 border-yellow-500/30";
    if (index === 1) return "bg-slate-400/10 border-slate-400/20";
    if (index === 2) return "bg-amber-600/10 border-amber-500/20";
    return "bg-blue-900/20 border-blue-800/20";
  };

  if (error) return (
    <div className="p-8 text-center text-red-400 font-semibold">{error}</div>
  );

  return (
    <div className="fadein mx-auto max-w-6xl">
      <div className="flex gap-5">
        {/* ── Leaderboard Table ── */}
        <div className="flex-1 overflow-hidden rounded-2xl border border-blue-800/40 bg-[rgba(5,15,45,0.75)] backdrop-blur-xl shadow-[0_0_40px_rgba(37,99,235,0.12)]">
          {/* Header */}
          <div className="border-b border-blue-800/40 bg-gradient-to-r from-blue-900/50 to-blue-800/30 px-6 py-5 text-center">
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              TypeMaster Leaderboard
            </h1>
            <p className="mt-1 text-sm text-blue-300/50">Top performers in Extru 2026</p>
          </div>

          {/* Rows */}
          <div className="p-4 space-y-2">
            <AnimatePresence>
              {players.map((player, index) => (
                <motion.div
                  key={player.unique_id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3, delay: index * 0.07 }}
                  className={`relative flex items-center gap-4 rounded-xl border p-4 transition-all hover:scale-[1.01] hover:shadow-[0_4px_20px_rgba(37,99,235,0.15)] ${rankBgClass(index)}`}
                >
                  {/* Progress bar at bottom */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-[2px] rounded-bl-xl rounded-br-xl bg-gradient-to-r from-blue-500 to-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${player.accuracy}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.07 }}
                  />

                  {/* Rank */}
                  <div className="flex w-10 items-center justify-center">
                    {getPositionIcon(index)}
                  </div>

                  {/* Rank number badge */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900/60 border border-blue-700/40 text-sm font-bold text-blue-300">
                    {index + 1}
                  </div>

                  {/* Avatar + Name */}
                  <div className="flex flex-1 items-center gap-3">
                    <img
                      src={player.avatar || "/placeholder.svg"}
                      alt={player.name}
                      className="h-11 w-11 rounded-full border-2 border-blue-500/40 object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-blue-50">{player.name}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-blue-300/60">
                        {player.university && (
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {player.university}
                          </div>
                        )}
                        {player.role && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {player.role}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-5">
                    <motion.div
                      className="text-center"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30, delay: index * 0.07 + 0.2 }}
                    >
                      <div className="text-2xl font-black text-blue-400">{player.wpm}</div>
                      <div className="text-[10px] uppercase tracking-widest text-blue-400/50">WPM</div>
                    </motion.div>
                    <motion.div
                      className="text-center"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30, delay: index * 0.07 + 0.3 }}
                    >
                      <div className="min-w-[90px] text-2xl font-black text-emerald-400">{player.accuracy}%</div>
                      <div className="text-[10px] uppercase tracking-widest text-blue-400/50">Accuracy</div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Sidebar Stats ── */}
        <div className="flex flex-col gap-4 w-60">
          {/* Average WPM */}
          <div className="glass-card p-6 flex flex-col items-center text-center">
            <div className="mb-3 rounded-full bg-blue-500/15 p-3 border border-blue-500/25">
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-widest text-blue-300/60">Average WPM</h2>
            <motion.div
              className="text-5xl font-black text-blue-400"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {averageWPM}
            </motion.div>
            <p className="mt-2 text-xs text-blue-300/40">Across all participants</p>
          </div>

          {/* Total Participants */}
          <div className="glass-card p-6 flex flex-col items-center text-center">
            <div className="mb-3 rounded-full bg-cyan-500/15 p-3 border border-cyan-500/25">
              <PersonStanding className="h-8 w-8 text-cyan-400" />
            </div>
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-widest text-blue-300/60">Total Participants</h2>
            <motion.div
              className="text-5xl font-black text-cyan-400"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.1 }}
            >
              {totalPlayers}
            </motion.div>
            <p className="mt-2 text-xs text-blue-300/40">Extru 2026</p>
          </div>

          {/* QR Code */}
          <div className="glass-card p-5 flex flex-col items-center text-center">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-300/60">Visit Us</h2>
            <div className="overflow-hidden rounded-xl border border-blue-700/30">
              <img src={qr} alt="QR Code" className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;