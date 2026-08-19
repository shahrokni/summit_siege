import {
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  type Scene,
} from "@babylonjs/core";
import { createEntities, type TMeshCollection } from "./entities";
import type { ILevel } from "../level";

export class LevelOne implements ILevel {
  constructor(scene: Scene, onFinish: () => void) {
    this.scene = scene;
    this.onFinish = onFinish;
  }

  private scene: Scene;
  private camera: ArcRotateCamera | undefined;
  private light: HemisphericLight | undefined;
  private meshCollection: TMeshCollection | undefined;
  private onFinish: () => void;

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
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.8;
    return light;
  }

  private addEntities(scene: Scene) {
    return createEntities(scene);
  }

  run() {
    this.camera = this.setupCameras(this.scene);
    this.light = this.setupLights(this.scene);
    this.meshCollection = this.addEntities(this.scene);
  }
}
