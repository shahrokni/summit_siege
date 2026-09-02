import { Engine } from "@babylonjs/core";
import { Manager } from "./scene";

export async function game(
  canvas: HTMLCanvasElement,
  overlay: HTMLDivElement,
): Promise<() => void> {
  const engine = new Engine(canvas, true);
  const manager = new Manager(engine, canvas, overlay);
  const scene = await manager.run();

  engine.runRenderLoop(() => {
    scene.render();
  });

  const handleResize = (): void => {
    engine.resize();
  };

  window.addEventListener("resize", handleResize);

  return (): void => {
    window.removeEventListener("resize", handleResize);
    scene.dispose();
    engine.dispose();
  };
}
