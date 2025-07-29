import { useState, useEffect, useRef } from 'react';

function StreamingText({ text = '', speed = 30, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const isInitialMount = useRef(true);
    const timeoutRef = useRef(null);
    const speechRef = useRef(null);
    const utteranceRef = useRef(null);

    useEffect(() => {
        speechRef.current = window.speechSynthesis;
        
        return () => {
            if (speechRef.current) {
                speechRef.current.cancel();
            }
        };
    }, []);

    useEffect(() => {
        const cleanup = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (speechRef.current) {
                speechRef.current.cancel();
            }
            if (utteranceRef.current) {
                utteranceRef.current = null;
            }
        };

        cleanup(); 
        setCurrentIndex(0);
        setIsComplete(false);
        setIsPaused(false);
        isInitialMount.current = true;

        return cleanup;
    }, [text]);

    useEffect(() => {
        if (!text || isComplete || isPaused) {
            return;
        }

        if (currentIndex >= text.length) {
            setIsComplete(true);
            onComplete?.();
            return;
        }

        const punctuation = ['.', '?', '!', ','];
        let isPunctuation;

        const currentChar = text[currentIndex - 1];
        if(currentChar && punctuation.includes(currentChar)) {
            isPunctuation = true;
        }
        const nextTimeout = isPunctuation ? speed * 25 : speed;

        timeoutRef.current = setTimeout(() => {
            setCurrentIndex(i => i + 1);
        }, nextTimeout);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [currentIndex, text, speed, isComplete, isPaused, onComplete]);

    const handlePause = (e) => {
        e.stopPropagation();
        if (isComplete) return;
        setIsPaused(prev => {
            if (!prev) { 
                if (utteranceRef.current && !isMuted) {
                    speechRef.current?.pause();
                }
            } else { 
                if (utteranceRef.current && !isMuted) {
                    speechRef.current?.resume();
                }
            }
            return !prev;
        });
    };

    const handleComplete = (e) => {
        e.stopPropagation();
        if (isComplete) return;
        
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (utteranceRef.current) {
            speechRef.current?.cancel();
        }
        
        setCurrentIndex(text.length);
        setIsComplete(true);
        setIsPaused(false);
        onComplete?.();
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        
        setIsMuted(prev => {
            const newMutedState = !prev;
            
            if (speechRef.current) {
                speechRef.current.cancel();
            }

            if (!newMutedState && !isComplete && !isPaused) {
                const remainingText = text.slice(currentIndex);
                const utterance = new SpeechSynthesisUtterance(remainingText);
                utterance.rate = 0.9;
                utterance.pitch = 1;
                utterance.volume = 0.8;
                
                utteranceRef.current = utterance;
                speechRef.current?.speak(utterance);
            }
            
            return newMutedState;
        });
    };

    const displayedText = text.slice(0, currentIndex);

    useEffect(() => {
        if (!text || isMuted || isComplete || isPaused || currentIndex === 0) return;

        if (currentIndex === 1 || isInitialMount.current) {
            isInitialMount.current = false;

            if (speechRef.current) {
                speechRef.current.cancel();
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 0.8;

            utteranceRef.current = utterance;
            speechRef.current?.speak(utterance);
        }

        return () => {
            if (isComplete && speechRef.current) {
                speechRef.current.cancel();
            }
        };
    }, [currentIndex, text, isMuted, isComplete, isPaused]);

    return (
        <div className="streaming-text-container">
            <p className="streaming-text">
                {displayedText}
                {!isComplete && <span className="cursor">|</span>}
            </p>
            {!isComplete && (
                <div className="streaming-controls">
                    <button 
                        onClick={handlePause} 
                        className={`control-btn ${isPaused ? 'paused' : ''}`}
                        title={isPaused ? "Resume" : "Pause"}
                    >
                        {isPaused ? '▶' : '⏸'}
                    </button>
                    <button 
                        onClick={handleComplete} 
                        className="control-btn"
                        title="Skip to end"
                    >
                        ⏭
                    </button>
                    <button
                        onClick={toggleMute}
                        className={`control-btn ${isMuted ? 'muted' : ''}`}
                        title={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? '🔇' : '🔊'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default StreamingText;
