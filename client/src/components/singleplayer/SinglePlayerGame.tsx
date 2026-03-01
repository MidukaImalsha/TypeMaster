import React, { useMemo, useState, useEffect, useRef } from "react";
import { useParagraph } from "../../helpers/useParagraph";
import BlinkingCursor from "../../utils/BlinkingCursor";
import Results from "./Results";
import { useLoader } from "../../utils/LoaderContext";
import { AlertCircle, Timer } from "lucide-react";

const SinglePlayerGame = () => {
    const { paragraph, isLoading } = useParagraph();
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [tracking, setTracking] = useState<string[][]>([]);
    const [timer, setTimer] = useState(30);
    const [isStarted, setIsStarted] = useState(false);
    const focusRef = useRef<HTMLDivElement>(null);
    const { showLoader, hideLoader } = useLoader();
    const [isCapsLockOn, setIsCapsLockOn] = useState(false);
    /* const [liveProgress, setLiveProgress] = useState(0);

    const trackProgress = () => {
        const totalCharacters = paragraph.join(" ").length;
        const typedCharacters = tracking.reduce((count, word) => count + word.length, 0);
        const progress = (typedCharacters / totalCharacters) * 100;
    }; */

    useEffect(() => {
        focusRef.current?.focus();
        if (isLoading) {
            showLoader();
        } else {
            hideLoader();
        }
    }, [isLoading, paragraph, showLoader, hideLoader]);

    useEffect(() => {
        const checkCapsLock = (e: KeyboardEvent) => {
            setIsCapsLockOn(e.getModifierState('CapsLock'));
        };

        window.addEventListener('keydown', checkCapsLock);
        window.addEventListener('keyup', checkCapsLock);

        return () => {
            window.removeEventListener('keydown', checkCapsLock);
            window.removeEventListener('keyup', checkCapsLock);
        };
    }, []);

    const correctOrIncorrect = (wordIndex: number, letterIndex: number) => {
        if (tracking[wordIndex] === undefined) return "text-letter-unchecked";
        if (tracking[wordIndex][letterIndex] === undefined)
            return "text-letter-unchecked";
        if (
            paragraph[wordIndex][letterIndex] ===
            tracking[wordIndex][letterIndex]
        )
            return "text-letter-correct";
        return "text-letter-incorrect";
    };

    const extraIncorrect = (wordIndex: number): JSX.Element[] | undefined => {
        const currentWord = tracking[wordIndex];
        const expectedLength = paragraph[wordIndex]?.length;

        if (!currentWord || !expectedLength) return;

        const extraLetters = currentWord.slice(expectedLength);

        return extraLetters.map((letter, index) => (
            <span key={index} className="text-letter-incorrect">
                {letter}
            </span>
        ));
    };

    const inCompletedWord = (wordIndex: number) => {
        // Only check words that user has moved past
        if (wordIndex >= currentWordIndex) return "";

        // Check if word exists and lengths don't match
        if (tracking[wordIndex] === undefined) return "";
        if (
            tracking[wordIndex].length !== paragraph[wordIndex].length ||
            paragraph[wordIndex] !== tracking[wordIndex].join("")
        ) {
            return "underline decoration-letter-incorrect";
        }
        return "";
    };

    const renderParagraph = useMemo(() => {
        return paragraph.map((word, wordIndex) => (
            <div
                key={wordIndex}
                className={`word ${inCompletedWord(wordIndex)}`}
            >
                {word.split("").map((letter, letterIndex) => (
                    <span
                        key={letterIndex}
                        className={correctOrIncorrect(wordIndex, letterIndex)}
                    >
                        {letter}
                    </span>
                ))}
                {extraIncorrect(wordIndex)}
            </div>
        ));
    }, [paragraph, tracking]);

    const handleInput = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!isStarted) setIsStarted(true);
        const isValidKey =
            /^[a-zA-Z0-9 .,;!?'"@#$%&()-]$/.test(e.key) ||
            e.key === "Backspace" ||
            e.key === " ";
        if (!isValidKey) return;

        /* const isCorrectKey =
            e.key === paragraph[currentWordIndex][currentLetterIndex]; */
        const isSpaceKey = e.key === " ";
        const isBackspace = e.key === "Backspace";

        if (isBackspace) {
            // Don't go back if at start of first word
            if (currentLetterIndex === 0 && currentWordIndex === 0) return;

            // Handle backspace at start of word
            if (currentLetterIndex === 0 && currentWordIndex > 0) {
                setCurrentWordIndex(currentWordIndex - 1);
                setCurrentLetterIndex(
                    () => tracking[currentWordIndex - 1]?.length || 0,
                );
                setTracking((prev) => prev.slice(0, -1));
                return;
            }

            // Normal backspace within word
            setCurrentLetterIndex(currentLetterIndex - 1);
            setTracking((prev) => {
                const newArray = [...prev];
                newArray[newArray.length - 1] = newArray[
                    newArray.length - 1
                ].slice(0, -1);
                return newArray;
            });
            return;
        }

        // Original input handling
        setTracking((prev) => {
            if (isSpaceKey) return [...prev, []];
            return prev.length === 0
                ? [[e.key]]
                : [...prev.slice(0, -1), [...prev[prev.length - 1], e.key]];
        });

        if (isSpaceKey) {
            setCurrentWordIndex(currentWordIndex + 1);
            setCurrentLetterIndex(0);
        } else {
            setCurrentLetterIndex(currentLetterIndex + 1);
        }

        //console.log(tracking);
    };

    const getCurrentWordLength = () => {
        return tracking[currentWordIndex]?.length || 0;
    };

    useEffect(() => {

        let intervalId: NodeJS.Timeout;

        if (isStarted && timer > 0) {
            intervalId = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isStarted, timer]);

    return (
        <>
            {timer === 0 ? (
                <>
                    <div className="timer mb-4 text-center text-4xl font-black tracking-widest uppercase bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                        Game Over
                    </div>
                    <Results typed={tracking} paragraph={paragraph} />
                </>
            ) : (
                <>
                    {!isLoading && (
                        <>
                            <div className="test fadein relative rounded-xl pb-12 font-mono">
                                {/* Timer */}
                                <div className="absolute top-5 left-8 timer fadein flex items-center gap-2 text-3xl">
                                    <Timer className="h-7 w-7" />
                                    {timer}
                                </div>

                                {/* Caps Lock Warning */}
                                {isCapsLockOn && (
                                    <div className="absolute top-4 right-[45%] fadein flex items-center gap-2 rounded-lg border border-yellow-500/50 bg-yellow-500/20 px-3 py-2 text-sm font-semibold text-yellow-300 backdrop-blur-sm">
                                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                                        Caps Lock is ON
                                    </div>
                                )}

                                {/* Typing area */}
                                <div
                                    ref={focusRef}
                                    className="paragraph mx-auto flex h-[350px] w-full flex-wrap overflow-clip px-8 pt-16 pb-8 text-4xl leading-relaxed tracking-wide text-white/80 outline-none hover:cursor-default"
                                    tabIndex={0}
                                    onKeyDown={handleInput}
                                >
                                    {renderParagraph}
                                </div>

                                <BlinkingCursor
                                    wordIndex={currentWordIndex}
                                    letterIndex={currentLetterIndex}
                                    text={paragraph.join(" ")}
                                    currentWordLength={getCurrentWordLength()}
                                />
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default SinglePlayerGame;
