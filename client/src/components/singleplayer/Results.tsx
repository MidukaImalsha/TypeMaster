import React, { useMemo } from "react";
import { Zap, Target, BarChart2, RefreshCw } from "lucide-react";

interface ResultsProps {
    typed: string[][];
    paragraph: string[];
    time?: number;
}

const Results: React.FC<ResultsProps> = ({ typed, paragraph, time = 30 }) => {
    const results = useMemo(() => {
        let typedWords = typed.length;
        let correctWords = 0;

        typed.forEach((typedWord, wordIndex) => {
            const expectedWord = paragraph[wordIndex] || "";
            if (typedWord.join("") === expectedWord) {
                correctWords++;
            }
        });

        const minutes = time / 60;
        const rawWPM = Math.round(typedWords / minutes);
        const correctWPM = Math.round(correctWords / minutes);
        const accuracy = typedWords > 0 ? Math.round((correctWords / typedWords) * 100) : 0;

        return { rawWPM, correctWPM, accuracy };
    }, [typed, paragraph, time]);

    const stats = [
        {
            label: "Correct WPM",
            value: results.correctWPM,
            unit: "wpm",
            icon: <Zap className="h-6 w-6" />,
            color: "text-blue-400",
            glowColor: "rgba(59,130,246,0.35)",
            borderColor: "border-blue-500/30",
            bgColor: "bg-blue-500/10",
        },
        {
            label: "Raw WPM",
            value: results.rawWPM,
            unit: "wpm",
            icon: <BarChart2 className="h-6 w-6" />,
            color: "text-cyan-400",
            glowColor: "rgba(34,211,238,0.3)",
            borderColor: "border-cyan-500/30",
            bgColor: "bg-cyan-500/10",
        },
        {
            label: "Accuracy",
            value: results.accuracy,
            unit: "%",
            icon: <Target className="h-6 w-6" />,
            color: "text-emerald-400",
            glowColor: "rgba(52,211,153,0.3)",
            borderColor: "border-emerald-500/30",
            bgColor: "bg-emerald-500/10",
        },
    ];

    return (
        <div className="fadein mx-auto max-w-lg mt-8">
            <div className="glass-card p-8 text-center">
                <h2 className="mb-2 text-3xl font-black tracking-tight bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                    Results
                </h2>
                <p className="mb-8 text-sm text-blue-300/50 uppercase tracking-widest">Your typing performance</p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`flex flex-col items-center rounded-xl border p-5 ${stat.borderColor} ${stat.bgColor} transition-all hover:scale-105`}
                            style={{ boxShadow: `0 0 20px ${stat.glowColor}` }}
                        >
                            <div className={`mb-3 ${stat.color}`}>{stat.icon}</div>
                            <div className={`text-4xl font-black ${stat.color}`}>
                                {stat.value}
                                <span className="text-lg font-semibold ml-0.5">{stat.unit}</span>
                            </div>
                            <div className="mt-2 text-[10px] uppercase tracking-widest text-blue-300/50">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => window.location.reload()}
                    className="btn-primary gap-2"
                >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </button>
            </div>
        </div>
    );
};

export default Results;
