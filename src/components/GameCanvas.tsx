import { useEffect, useRef, type ReactElement } from "react";
import { game } from "../game/game";

export const GameCanvas = (): ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    let dispose: (() => void) | undefined;

    const init = async () => {
      dispose = await game(canvasRef.current!, overlayRef.current!);
    };

    void init();

    return () => {
      dispose?.();
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <canvas
        id="canvas"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
        ref={canvasRef}
      />
      <div
        id="overlay"
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          pointerEvents: "none",
        }}
      ></div>
    </div>
  );
};
