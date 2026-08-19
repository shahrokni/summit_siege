import { Engine, Scene } from "@babylonjs/core";
import { createScene } from "./scene";

export class Game {
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.scene = createScene(this.engine);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener("resize", this.handleResize);
  }

  /* private */
  private engine: Engine;
  private scene: Scene;

  private handleResize = () => {
    this.engine.resize();
  };

  /* public */
  dispose(): void {
    window.removeEventListener("resize", this.handleResize);
    this.scene.dispose();
    this.engine.dispose();
  }
}
