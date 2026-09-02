import {
  HemisphericLight,
  MeshBuilder,
  Vector3,
  type Scene,
} from "@babylonjs/core";

import type { ILevel } from "../level";
import { EntityManager } from "./entities";
import { InputManager, type TEvent } from "./input";
import type { ISubscriber } from "../../scene";
import { StateManager } from "./state";
import { SkyMaterial } from "@babylonjs/materials/sky";
import { Camera } from "./entities/camera";

export class LevelOne implements ILevel, ISubscriber<TEvent> {
  constructor(
    scene: Scene,
    canvas: HTMLCanvasElement,
    overlay: HTMLDivElement,
    onFinish: () => void,
  ) {
    this.id = "levelOne";
    this.canvas = canvas;
    this.overlay = overlay;
    this.scene = scene;
    this.stateManager = new StateManager();
    this.onFinish = onFinish;
  }

  id: string;
  private scene: Scene;
  private light: HemisphericLight | undefined;
  private entityManager: EntityManager | undefined;
  private inputManager: InputManager | undefined;
  private stateManager: StateManager | undefined;
  private camera: Camera | undefined;
  private canvas: HTMLCanvasElement;
  private overlay: HTMLDivElement;

  private async setCanvas(): Promise<void> {
    await this.canvas.requestPointerLock({
      unadjustedMovement: true,
    });
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

  private setupSky(scene: Scene): void {
    if (!scene.activeCamera) return;

    const skyBox = MeshBuilder.CreateBox("skyBox", { size: 200 }, this.scene);
    const skyMaterial = new SkyMaterial("skyMaterial", scene);
    skyMaterial.backFaceCulling = false;
    skyMaterial.cameraOffset.y = scene.activeCamera.globalPosition.y;
    skyMaterial.inclination = 0;
    skyBox.material = skyMaterial;
    skyBox.infiniteDistance = false;
  }

  private handleScope(): void {
    const currentView = this.stateManager?.get("view");
    if (!currentView || !this.camera || !this.stateManager) return;

    switch (currentView) {
      case "normal":
        this.stateManager.setView("scope1");
        break;
      case "scope1":
        this.stateManager.setView("scope2");
        break;
      case "scope2":
        this.stateManager.setView("normal");
        break;
      default:
        break;
    }
    if (
      ["scope1", "scope2"].some((v) => v === this.stateManager?.get("view"))
    ) {
      this.overlay.style.background = `
                          radial-gradient(
                            circle at center,
                            transparent 0,
                            transparent 220px,
                            black 221px,
                            black 100%
                          )
                        `;
      this.overlay.style.backgroundImage = `
                        url('/scope-overlay.png'),
                        radial-gradient(
                          circle at center,
                          transparent 0,
                          transparent 220px,
                          black 221px,
                          black 100%
                        )
                      `;
      this.overlay.style.backgroundPosition = "center";
      this.overlay.style.backgroundRepeat = "no-repeat";
    } else {
      this.overlay.style.background = "";
      this.overlay.style.backgroundImage = "";
      this.overlay.style.backgroundPosition = "";
      this.overlay.style.backgroundRepeat = "";
    }

    this.camera.changeFov(this.stateManager.get("view"));
  }

  private handleFire(): void {}

  private run_loop(): void {}

  public notify(context: TEvent): void {
    switch (context) {
      case "scope":
        this.handleScope();
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

  public async run() {
    this.dispose();
    this.canvas.removeEventListener("click", this.setCanvas.bind(this));

    this.camera = new Camera(this.scene);
    this.light = this.setupLights(this.scene);
    this.canvas.addEventListener("click", this.setCanvas.bind(this));
    this.entityManager = new EntityManager(this.scene);
    await this.entityManager.init();
    this.inputManager = new InputManager();
    this.inputManager.subscribe(this);
    this.setupSky(this.scene);
  }
}
