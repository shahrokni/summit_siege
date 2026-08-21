import {
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  type Scene,
} from "@babylonjs/core";

import type { ILevel } from "../level";
import { EntityManager } from "./entities";

export class LevelOne implements ILevel {
  constructor(scene: Scene, onFinish: () => void) {
    this.scene = scene;
    this.onFinish = onFinish;
  }

  private scene: Scene;
  private camera: ArcRotateCamera | undefined;
  private light: HemisphericLight | undefined;
  private entityManager: EntityManager | undefined;

  private setupCameras(scene: Scene): ArcRotateCamera {
    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2, // horizontal rotation
      Math.PI / 3, // vertical rotation
      10, // distance from target
      Vector3.Zero(), // target
      scene,
    );
    camera.attachControl();
    return camera;
  }

  private setupLights(scene: Scene): HemisphericLight {
    const light = new HemisphericLight(
      "mainLight",
      new Vector3(0, 1, 0),
      scene,
    );
    light.intensity = 0.8;
    return light;
  }

  private run_loop(): void {}

  public dispose(): void {
    this.camera?.dispose();
    this.light?.dispose();
    this.entityManager?.dispose();
  }

  public onFinish(): void {}

  public run() {
    this.dispose();
    this.camera = this.setupCameras(this.scene);
    this.light = this.setupLights(this.scene);
    this.entityManager = new EntityManager(this.scene);
  }
}
