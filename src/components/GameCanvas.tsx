import { useEffect, useRef, type ReactElement } from "react";
import { game } from "../game/game";

export const GameCanvas = (): ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    let dispose: (() => void) | undefined;

    const init = async () => {
      dispose = await game(canvasRef.current!);
    };

    void init();

    return () => {
      dispose?.();
    };
  }, []);

  return (
    <canvas
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
      ref={canvasRef}
    />
  );
};
