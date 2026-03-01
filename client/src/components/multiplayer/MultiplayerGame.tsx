import React, { useState, useEffect } from "react";
import { useParagraph } from "../../helpers/useParagraph";
import Lobby from "../Lobby";
import io from "socket.io-client";
import MultiplayerTest from "./MultiplayerTest";
import { LobbyProps } from "../Lobby";
import { useLoader } from "../../utils/LoaderContext";
import { Users, Copy, Check, Play } from "lucide-react";

const socket = io(import.meta.env.VITE_SERVER_URI, {
    withCredentials: true,
    transports: ["websocket", "polling"],
});

interface Player {
    id: string;
    name: string;
    avatar: string;
}

const MultiplayerGame: React.FC = () => {
    const [gameId, setGameId] = useState<string | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const { paragraph, isLoading } = useParagraph();
    const [gameStarted, setGameStarted] = useState(false);
    const [gameParagraph, setGameParagraph] = useState<string[]>([]);
    const [playerName, setPlayerName] = useState<string>("");
    const [currentPlayer, setCurrentPlayer] = useState<{ id: string; name: string } | null>(null);
    const { showLoader, hideLoader } = useLoader();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isLoading) {
            showLoader();
        } else {
            hideLoader();
        }
    }, [isLoading, paragraph, showLoader, hideLoader]);

    useEffect(() => {
        socket.on("gameCreated", (id: string) => {
            setGameId(id);
        });

        socket.on(
            "playerJoined",
            (updatedPlayers: { id: string; name: string; avatar: string }[], gameId: string) => {
                setPlayers(updatedPlayers);
                setGameId(gameId);
            },
        );

        socket.on("gameStarted", (gameParagraph: string[]) => {
            setGameStarted(true);
            setGameParagraph(gameParagraph);
        });

        socket.on("joinError", (error: string) => {
            console.error(error);
        });

        return () => {
            socket.off("gameCreated");
            socket.off("playerJoined");
            socket.off("gameStarted");
            socket.off("joinError");
        };
    }, []);

    const createGame: LobbyProps["createGame"] = (playerID, playerName, additionalInfo) => {
        setPlayerName(playerName);
        setCurrentPlayer({ id: playerID, name: playerName });
        setPlayers([{ id: playerID, name: playerName, avatar: additionalInfo.selectedAvatar }]);
        socket.emit("createGame", { playerID, playerName, additionalInfo });
    };

    const joinGame: LobbyProps["joinGame"] = (gameId, playerName, playerID, additionalInfo) => {
        setPlayerName(playerName);
        setCurrentPlayer({ id: playerID, name: playerName });
        socket.emit("joinGame", { gameId, playerName, playerID, additionalInfo });
    };

    const startGame = () => {
        if (gameId) {
            socket.emit("startGame", { gameId, paragraph });
        }
    };

    const copyGameId = () => {
        if (gameId) {
            navigator.clipboard.writeText(gameId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="container relative mx-auto px-4 py-2">
            {/* ── Lobby (no game yet) ── */}
            {!gameId && <Lobby createGame={createGame} joinGame={joinGame} />}

            {/* ── Waiting Room ── */}
            {gameId && !gameStarted && (
                <div className="fadein mx-auto max-w-lg">
                    <div className="glass-card p-8">
                        {/* Header */}
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-full bg-blue-500/20 p-2.5 border border-blue-500/30">
                                <Users className="h-6 w-6 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-blue-100">Waiting for Players</h2>
                                <p className="text-xs text-blue-300/50">Share the Game ID to invite others</p>
                            </div>
                        </div>

                        {/* Game ID badge */}
                        <div
                            className="mb-6 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-blue-700/40 bg-blue-950/60 px-4 py-3 transition-all hover:border-blue-500/60 hover:bg-blue-900/40"
                            onClick={copyGameId}
                            title="Click to copy"
                        >
                            <div>
                                <p className="mb-0.5 text-[10px] uppercase tracking-widest text-blue-400/50">Game ID</p>
                                <span className="font-mono text-lg font-bold tracking-widest text-blue-300">
                                    {gameId}
                                </span>
                            </div>
                            <div className="flex-shrink-0 rounded-lg border border-blue-700/40 bg-blue-800/40 p-2 text-blue-400 transition-all hover:text-blue-200">
                                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                            </div>
                        </div>

                        {/* Players */}
                        <div className="mb-6">
                            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-blue-400/50">
                                Players ({players.length})
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {players.map((player) => (
                                    <div
                                        key={player.id}
                                        className="flex flex-col items-center gap-2"
                                    >
                                        <div className="relative">
                                            <img
                                                src={player.avatar}
                                                className="h-20 w-20 rounded-full border-2 border-blue-500/40 object-cover"
                                                alt={player.name}
                                            />
                                            {/* Online indicator */}
                                            <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-blue-950 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
                                        </div>
                                        <span className="text-sm font-semibold text-blue-200">
                                            {player.name}
                                        </span>
                                    </div>
                                ))}

                                {/* Empty slot placeholders */}
                                {players.length < 2 && (
                                    <div className="flex flex-col items-center gap-2 opacity-30">
                                        <div className="h-20 w-20 rounded-full border-2 border-dashed border-blue-600/50 bg-blue-900/30 flex items-center justify-center">
                                            <Users className="h-8 w-8 text-blue-500" />
                                        </div>
                                        <span className="text-xs text-blue-400">Waiting…</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="mb-5 border-t border-blue-800/40" />

                        {/* Start button — only for host, only when 2+ players */}
                        {players.length >= 2 ? (
                            <button
                                onClick={startGame}
                                className="btn-primary w-full py-3 text-base gap-2"
                            >
                                <Play className="h-5 w-5" />
                                Start Game
                            </button>
                        ) : (
                            <p className="text-center text-sm text-blue-300/40">
                                Need at least 2 players to start
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* ── Active Game ── */}
            {gameId && gameStarted && (
                <MultiplayerTest
                    gameId={gameId}
                    players={players}
                    paragraph={gameParagraph}
                    socket={socket}
                    playerName={playerName}
                    currentPlayer={currentPlayer}
                />
            )}
        </div>
    );
};

export default MultiplayerGame;
