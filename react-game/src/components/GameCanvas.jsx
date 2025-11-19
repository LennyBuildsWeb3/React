import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../game/GameEngine';
import './GameCanvas.css';

export default function GameCanvas() {
    const canvasRef = useRef(null);
    const engineRef = useRef(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [health, setHealth] = useState(100);

    useEffect(() => {
        if (!canvasRef.current) return;

        const engine = new GameEngine(
            canvasRef.current,
            (finalScore) => {
                setGameOver(true);
            },
            (newScore) => {
                setScore(newScore);
            }
        );

        engineRef.current = engine;
        engine.start();

        // Health update loop (separate from game loop for React state)
        const interval = setInterval(() => {
            if (engine.hero) {
                setHealth(engine.hero.health);
            }
        }, 100);

        return () => {
            engine.stop();
            clearInterval(interval);
        };
    }, []);

    const handleRestart = () => {
        setGameOver(false);
        setScore(0);
        setHealth(100);
        if (engineRef.current) {
            // Simple reload for now, or reset engine
            window.location.reload();
        }
    };

    return (
        <div className="game-container">
            <div className="ui-overlay">
                <div className="health-bar">
                    <div className="health-fill" style={{ width: `${health}%` }}></div>
                </div>
                <div className="score">Score: {score}</div>
            </div>

            {gameOver && (
                <div className="game-over-screen">
                    <h1>GAME OVER</h1>
                    <p>Final Score: {score}</p>
                    <button onClick={handleRestart}>Try Again</button>
                </div>
            )}

            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="game-canvas"
            />
        </div>
    );
}
