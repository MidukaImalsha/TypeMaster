import React, { useMemo } from 'react'
import Car1 from '../../assets/cars/car-1.webp'
import Car2 from '../../assets/cars/car-2.webp'
import Car3 from '../../assets/cars/car-3.webp'
import Car4 from '../../assets/cars/car-4.webp'
import Endline from '../../assets/cars/endline.webp'

interface PlayerRaceTrackProps {
    players: {
        id: string;
        name: string;
        avatar: string;
    }[];
    allProgress: { id: string; player: string; progress: number }[];
    currentPlayer: { id: string; name: string } | null;
}

const cars = [Car1, Car2, Car3, Car4];

const LiveProgress: React.FC<PlayerRaceTrackProps> = ({ players, allProgress, currentPlayer }) => {
    return (
        <div className='racetrack flex flex-col gap-3 mb-4 w-3/4 mx-auto'>
            {players.map((player, index) => {
                const playerProgress = useMemo(
                    () => allProgress.find(p => p.id === player.id)?.progress || 0,
                    [allProgress, player.id]
                );
                const isCurrentPlayer = currentPlayer?.id === player.id;
                return (
                    <div
                        key={player.id}
                        className={`relative h-11 overflow-hidden rounded-full transition-all ${isCurrentPlayer
                                ? 'border-2 border-blue-400/60 shadow-[0_0_14px_rgba(59,130,246,0.35)]'
                                : 'border border-blue-900/50'
                            }`}
                        style={{
                            background: isCurrentPlayer
                                ? 'linear-gradient(90deg, rgba(15,40,100,0.85) 0%, rgba(8,20,55,0.9) 100%)'
                                : 'linear-gradient(90deg, rgba(8,20,55,0.75) 0%, rgba(5,12,35,0.85) 100%)',
                        }}
                    >
                        {/* Dotted lane line */}
                        <div className='absolute top-0 left-[16%] h-full w-[76%] flex items-center pointer-events-none'>
                            <div className='w-full border-b-2 border-dotted border-blue-700/30'></div>
                        </div>

                        {/* Car */}
                        <div
                            className='absolute top-0 h-full transition-all duration-300 ease-out flex items-center'
                            style={{ left: `${playerProgress + 16}%` }}
                        >
                            <img
                                src={cars[index % cars.length]}
                                alt={`${player.name}'s car`}
                                className='w-20 h-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]'
                            />
                        </div>

                        {/* Player info */}
                        <div className='absolute top-0 left-4 w-36 overflow-hidden whitespace-nowrap h-full flex items-center gap-2'>
                            <img
                                src={player.avatar}
                                alt={player.name}
                                className={`h-7 w-7 rounded-full object-cover border ${isCurrentPlayer ? 'border-blue-400/60' : 'border-blue-700/40'}`}
                            />
                            <span className={`text-sm font-semibold ${isCurrentPlayer ? 'text-blue-200' : 'text-blue-300/70'}`}>
                                {player.name}
                            </span>
                        </div>

                        {/* Finish line */}
                        <div className='absolute top-0 right-[5%] h-full flex items-center'>
                            <img src={Endline} alt="Finish" className='w-8 opacity-70' />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default LiveProgress;
