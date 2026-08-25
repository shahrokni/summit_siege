import { Engine } from "@babylonjs/core";
import { Manager } from "./scene";

export async function game(canvas: HTMLCanvasElement): Promise<() => void> {
  const engine = new Engine(canvas, true);
  const manager = new Manager(engine);
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
