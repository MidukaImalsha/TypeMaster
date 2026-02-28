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
  PersonStanding 
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
        return <Trophy className="h-8 w-8 text-yellow-400" />;
      case 1:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 2:
        return <Award className="h-8 w-8 text-orange-400" />;
      default:
        return <Rocket className="h-8 w-8 text-blue-300" />;
    }
  };

  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex gap-6">
        {/* Leaderboard */}
        <div className="flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl">
          <div className="space-y-2 border-b border-blue-200 p-6 text-center">
            {/* Dark Gradient Heading */}
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
              TypeMaster Leaderboard
            </h1>
            <p className="text-black">Top performers in Extru 2026</p>
          </div>
          <div className="p-6">
            <AnimatePresence>
              {players.map((player, index) => (
                <motion.div
                  key={player.unique_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-4 ${
                    index % 2 === 0 ? "bg-blue-50" : "bg-blue-100"
                  } group relative mb-2 overflow-hidden rounded-xl transition-shadow hover:shadow-lg`}
                >
                  {/* Position Indicator */}
                  <div className="flex w-12 items-center justify-center">
                    {getPositionIcon(index)}
                  </div>

                  {/* Avatar and Name */}
                  <div className="flex flex-1 items-center gap-3">
                    <img
                      src={player.avatar || "/placeholder.svg"}
                      alt={player.name}
                      className="h-12 w-12 rounded-full border-2 border-blue-300"
                    />
                    <div>
                      <h3 className="font-semibold text-black">{player.name}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-black/70">
                        {player.university && (
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            {player.university}
                          </div>
                        )}
                        {player.role && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {player.role}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6">
                    <motion.div
                      className="text-center"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    >
                      <div className="text-2xl font-bold text-blue-600">{player.wpm}</div>
                      <div className="text-xs text-black/60">WPM</div>
                    </motion.div>
                    <motion.div
                      className="text-center"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    >
                      <div className="min-w-[110px] text-2xl font-bold text-green-600">
                        {player.accuracy}%
                      </div>
                      <div className="text-xs text-black/60">Accuracy</div>
                    </motion.div>
                  </div>

                  {/* Progress bar */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-300"
                    initial={{ width: 0 }}
                    animate={{ width: `${player.accuracy}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-col gap-3">
          <div className="w-64 self-start rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-center">
              <TrendingUp className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="mb-2 text-center text-2xl font-bold text-black">Average WPM</h2>
            <motion.div
              className="text-center text-4xl font-bold text-blue-600"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {averageWPM}
            </motion.div>
            <p className="mt-2 text-center text-sm text-black/70">Across all participants</p>
          </div>

          <div className="w-64 self-start rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-center">
              <PersonStanding className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="mb-2 text-center text-2xl font-bold text-black">Total Extru Participants</h2>
            <motion.div
              className="text-center text-4xl font-bold text-blue-600"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {totalPlayers}
            </motion.div>
          </div>

          <div className="w-64 self-start rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-2xl">
            <h2 className="mb-2 text-center text-2xl font-bold text-black">Visit Us</h2>
            <motion.div
              className="text-center text-4xl font-bold text-blue-600"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <img src={qr} alt="QR Code" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;