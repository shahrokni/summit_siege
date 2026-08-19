import { useEffect, useRef, type ReactElement } from "react";
import { Game } from "../game/game";

export const GameCanvas = (): ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const game = new Game(canvasRef.current);

    return () => {
      game.dispose();
    };
  }, []);

  return (
    <canvas
      style={{ width: "100%", height: "100%", display: "block" }}
      ref={canvasRef}
    />
  );
};
