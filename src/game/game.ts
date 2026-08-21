import { Engine, Scene } from "@babylonjs/core";
import { Manager } from "./scene";

export class Game {
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.manager = new Manager(this.engine);
    this.scene = this.manager.run();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener("resize", this.handleResize);
  }

  /* private */
  private engine: Engine;
  private scene: Scene;
  private manager: Manager;

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
