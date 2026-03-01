import React, { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { bigEars } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

interface PopupFormProps {
    onSubmit: (
        playerName: string,
        additionalInfo: {
            university: string;
            role: string;
            isSchoolStudent: boolean;
            selectedAvatar: string;
        },
    ) => void;
    onClose: () => void;
    buttonText: string;
}

const inputClass =
    "w-full rounded-lg border border-blue-700/50 bg-blue-950/60 px-3 py-2 text-sm text-blue-100 placeholder:text-blue-400/40 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all";

const selectClass =
    "w-full rounded-lg border border-blue-700/50 bg-blue-950/80 px-3 py-2 text-sm text-blue-100 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all";

const PopupForm: React.FC<PopupFormProps> = ({ onSubmit, onClose, buttonText }) => {
    const [playerName, setPlayerName] = useState("");
    const [university, setUniversity] = useState("");
    const [role, setRole] = useState("");
    const [isSchoolStudent, setIsSchoolStudent] = useState(false);
    const [warning, setWarning] = useState(false);
    const [vibrating, setVibrating] = useState(false);
    const [avatars, setAvatars] = useState<string[]>([]);
    const [selectedAvatar, setSelectedAvatar] = useState<string>("");

    useEffect(() => {
        const newAvatars = Array.from({ length: 6 }, () =>
            createAvatar(bigEars, { seed: Math.random().toString() }).toDataUri(),
        );
        setAvatars(newAvatars);
        setSelectedAvatar(newAvatars[0]);
    }, []);

    const handleSubmit = () => {
        if (playerName) {
            onSubmit(playerName, { university, role, isSchoolStudent, selectedAvatar });
        } else {
            setWarning(true);
            setVibrating(true);
            setTimeout(() => setVibrating(false), 300);
        }
    };

    return (
        <div className="relative flex max-w-lg w-full mx-4 overflow-hidden rounded-2xl border border-blue-700/40 bg-[rgba(8,20,60,0.95)] shadow-[0_0_60px_rgba(37,99,235,0.3)] backdrop-blur-xl fadein">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute right-3 top-3 z-10 rounded-full border border-blue-700/40 bg-blue-900/50 p-1.5 text-blue-300 transition-all hover:bg-red-500/80 hover:text-white hover:border-red-400/60"
            >
                <X size={16} />
            </button>

            {/* Avatar picker */}
            <div className="border-r border-blue-800/50 p-5 flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-400/70 mb-1">
                    Choose Avatar
                </p>
                <div className="grid grid-cols-3 gap-2">
                    {avatars.map((avatar, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedAvatar(avatar)}
                            className={`relative cursor-pointer rounded-full transition-all duration-200 ${selectedAvatar === avatar
                                    ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-blue-950 scale-105"
                                    : "opacity-60 hover:opacity-90 hover:scale-105"
                                }`}
                        >
                            <img src={avatar} alt={`Avatar ${index + 1}`} className="h-16 w-16 rounded-full" />
                            {selectedAvatar === avatar && (
                                <div className="absolute -bottom-1 -right-1 rounded-full bg-blue-500 p-0.5">
                                    <Check size={10} className="text-white" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form fields */}
            <div className="flex flex-1 flex-col gap-4 p-5 pt-10 min-w-[220px]">
                <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-blue-400/70">
                        Display Name *
                    </label>
                    <input
                        type="text"
                        placeholder="Your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-blue-400/70">
                        University
                    </label>
                    <select value={university} onChange={(e) => setUniversity(e.target.value)} className={selectClass}>
                        <option value="" style={{ background: "#060e2a" }}>Select (optional)</option>
                        <option value="RUSL" style={{ background: "#060e2a" }}>Rajarata University of Sri Lanka</option>
                        <option value="UoC" style={{ background: "#060e2a" }}>University of Colombo</option>
                        <option value="UoP" style={{ background: "#060e2a" }}>University of Peradeniya</option>
                        <option value="UoK" style={{ background: "#060e2a" }}>University of Kelaniya</option>
                        <option value="UoJ" style={{ background: "#060e2a" }}>University of Jaffna</option>
                        <option value="USJP" style={{ background: "#060e2a" }}>University of Sri Jayewardenepura</option>
                        <option value="UoM" style={{ background: "#060e2a" }}>University of Moratuwa</option>
                        <option value="OUSL" style={{ background: "#060e2a" }}>The Open University of Sri Lanka</option>
                        <option value="EUSL" style={{ background: "#060e2a" }}>Eastern University of Sri Lanka</option>
                        <option value="SUSL" style={{ background: "#060e2a" }}>Sabaragamuwa University of Sri Lanka</option>
                        <option value="Other" style={{ background: "#060e2a" }}>Other</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-blue-400/70">
                        Role
                    </label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className={selectClass}>
                        <option value="" style={{ background: "#060e2a" }}>Select (optional)</option>
                        <option value="student" style={{ background: "#060e2a" }}>Student</option>
                        <option value="staff" style={{ background: "#060e2a" }}>Staff</option>
                        <option value="lecturer" style={{ background: "#060e2a" }}>Lecturer</option>
                    </select>
                </div>

                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-blue-200/70">
                    <input
                        type="checkbox"
                        id="isSchoolStudent"
                        checked={isSchoolStudent}
                        onChange={(e) => setIsSchoolStudent(e.target.checked)}
                        className="h-4 w-4 rounded border-blue-600 accent-blue-500"
                    />
                    I am a school student
                </label>

                {warning && (
                    <p className={`text-sm text-red-400 ${vibrating ? "vibrate" : ""}`}>
                        ⚠ Please enter your name to continue
                    </p>
                )}

                <button onClick={handleSubmit} className="btn-primary mt-auto w-full py-2.5">
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default PopupForm;
