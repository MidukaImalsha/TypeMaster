import React, { useState } from "react";
import PopupForm from "./multiplayer/PopupForm";
import GlowingLogo from "../utils/GlowingLogo";
import typeMasterLogo from "../assets/logos/TypeMasterLogo.webp";
import { Plus, LogIn, AlertTriangle } from "lucide-react";

export interface LobbyProps {
  createGame: (
    playerID: string,
    playerName: string,
    additionalInfo: {
      university: string;
      role: string;
      isSchoolStudent: boolean;
      selectedAvatar: string;
    },
  ) => void;
  joinGame: (
    id: string,
    playerName: string,
    playerID: string,
    additionalInfo: {
      university: string;
      role: string;
      isSchoolStudent: boolean;
      selectedAvatar: string;
    },
  ) => void;
}

const Lobby: React.FC<LobbyProps> = ({ createGame, joinGame }) => {
  const [gameId, setGameId] = useState("");
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [warning, setWarning] = useState(false);
  const [vibrating, setVibrating] = useState(false);

  const handleCreateGame = (
    playerName: string,
    additionalInfo: {
      university: string;
      role: string;
      isSchoolStudent: boolean;
      selectedAvatar: string;
    },
  ) => {
    const playerID = Math.random().toString(36).substring(7);
    createGame(playerID, playerName, additionalInfo);
    setIsOverlayVisible(false);
  };

  const handleJoinGame = (
    playerName: string,
    additionalInfo: {
      university: string;
      role: string;
      isSchoolStudent: boolean;
      selectedAvatar: string;
    },
  ) => {
    if (gameId) {
      const playerID = Math.random().toString(36).substring(7);
      joinGame(gameId, playerName, playerID, additionalInfo);
      setIsOverlayVisible(false);
    }
  };

  const showCreateGamePopup = () => {
    setIsCreatingGame(true);
    setIsOverlayVisible(true);
  };

  const showJoinGamePopup = () => {
    if (gameId) {
      setIsCreatingGame(false);
      setIsOverlayVisible(true);
    } else {
      setWarning(true);
      setVibrating(true);
      setTimeout(() => setVibrating(false), 300);
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsOverlayVisible(false);
    }
  };

  return (
    <>
      {isOverlayVisible && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleOutsideClick}
        >
          <PopupForm
            onSubmit={isCreatingGame ? handleCreateGame : handleJoinGame}
            onClose={() => setIsOverlayVisible(false)}
            buttonText={isCreatingGame ? "Create New Game" : "Join Game"}
          />
        </div>
      )}

      <div className="fadein flex flex-col items-center">
        {/* Logo */}
        <div className="flex h-48 w-full items-center justify-center mb-4">
          <GlowingLogo src={typeMasterLogo} alt="logo" />
        </div>

        {/* Title */}
        <h2 className="mb-8 text-center text-3xl font-black tracking-tight bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
          EXTRU Type Master 2026
        </h2>

        {/* Cards */}
        <div className="grid w-full max-w-xl grid-cols-2 gap-4">
          {/* Create Game */}
          <div className="glass-card flex flex-col items-center justify-center gap-4 p-8">
            <div className="rounded-full bg-blue-500/20 p-4 border border-blue-400/30">
              <Plus className="h-8 w-8 text-blue-400" />
            </div>
            <span className="text-sm font-semibold text-blue-200/70 uppercase tracking-widest">Create Room</span>
            <button
              onClick={showCreateGamePopup}
              className="btn-primary w-full"
            >
              Create New Game
            </button>
          </div>

          {/* Join Game */}
          <div className="glass-card flex flex-col items-center justify-center gap-4 p-8">
            <div className="rounded-full bg-cyan-500/20 p-4 border border-cyan-400/30">
              <LogIn className="h-8 w-8 text-cyan-400" />
            </div>
            <span className="text-sm font-semibold text-blue-200/70 uppercase tracking-widest">Join Room</span>
            <input
              type="text"
              placeholder="Enter Game ID"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              className="w-full rounded-lg border border-blue-700/50 bg-blue-950/60 px-3 py-2 text-sm text-blue-100 placeholder:text-blue-400/40 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
            <button
              onClick={showJoinGamePopup}
              className="w-full inline-flex items-center justify-center gap-2 rounded-[0.625rem] border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-300 transition-all duration-200 hover:bg-cyan-500/20 hover:border-cyan-400/60 hover:shadow-[0_0_16px_rgba(34,211,238,0.15)]"
            >
              <LogIn className="h-4 w-4" />
              Join Game
            </button>
            {warning && (
              <div className={`flex items-center gap-2 text-sm text-red-400 ${vibrating ? "vibrate" : ""}`}>
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>Please enter a Game ID</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Lobby;
