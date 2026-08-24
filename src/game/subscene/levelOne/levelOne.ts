import {
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  type Scene,
} from "@babylonjs/core";

import type { ILevel } from "../level";
import { EntityManager } from "./entities";
import { InputManager, type TEvent } from "./input";
import type { ISubscriber } from "../../scene";
import { StateManager } from "./state";

export class LevelOne implements ILevel, ISubscriber<TEvent> {
  constructor(scene: Scene, onFinish: () => void) {
    this.id = "levelOne";
    this.scene = scene;
    this.stateManager = new StateManager();
    this.onFinish = onFinish;
  }
  id: string;

  private scene: Scene;
  private camera: ArcRotateCamera | undefined;
  private light: HemisphericLight | undefined;
  private entityManager: EntityManager | undefined;
  private inputManager: InputManager | undefined;
  private stateManager: StateManager | undefined;

  private setupCameras(scene: Scene): ArcRotateCamera {
    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 4,
      Math.PI / 3,
      60,
      Vector3.Zero(),
      scene,
    );
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

  private handleScope(): void {
    const view = this.stateManager?.get("view");
    if (!view) return;

    if (view === "normal") {
      /* TODO */
      this.stateManager?.setView("scope1");
    } else if (view === "scope1") {
      /* TODO */
      this.stateManager?.setView("scope2");
    } else {
      /* TODO */
      this.stateManager?.setView("normal");
    }
  }

  private handleFire(): void {}

  private handleDirection(dir: Extract<TEvent, "left" | "right">): void {
    if (!this.camera) return;

    const rotationSpeed = 0.01;
    if (dir === "right") {
      this.camera.alpha += rotationSpeed;
    } else {
      this.camera.alpha -= rotationSpeed;
    }
  }

  private run_loop(): void {}

  public notify(context: TEvent): void {
    switch (context) {
      case "scope":
        this.handleScope();
        break;
      case "left":
      case "right":
        this.handleDirection(context);
        break;
      default:
        break;
    }
  }

  public dispose(): void {
    this.camera?.dispose();
    this.light?.dispose();
    this.entityManager?.dispose();
    this.inputManager?.dispose();
  }

  public onFinish(): void {}

  public run() {
    this.dispose();
    this.camera = this.setupCameras(this.scene);
    this.light = this.setupLights(this.scene);
    this.entityManager = new EntityManager(this.scene);
    this.inputManager = new InputManager();
    this.inputManager.subscribe(this);
  }
}
