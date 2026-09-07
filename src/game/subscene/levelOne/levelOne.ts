import {
  HemisphericLight,
  MeshBuilder,
  Sound,
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
import type { DecoyEntity } from "../../shared_entities/decoy/decoy";

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
    this.gunSound = new Sound(
      "gun-shot",
      "/sound/sniper_gun_fire.mp3",
      this.scene,
      undefined,
      {
        volume: 0.7,
      },
    );
    this.helicopterSound = new Sound(
      "helicopter",
      "/sound/helicopter.mp3",
      this.scene,
      () => {
        this.helicopterSound.play();
      },
      {
        loop: true,
        autoplay: false,
        volume: 0.35,
      },
    );

    this.radioChatSound = new Sound(
      "helicopter",
      "/sound/radio_chat.mp3",
      this.scene,
      () => {
        this.helicopterSound.play();
      },
      {
        loop: false,
        autoplay: false,
        volume: 0.6,
      },
    );

    this.helicopterSound.play();
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
  private gunLock: boolean = false;
  private gunSound: Sound;
  private helicopterSound: Sound;
  private radioChatSound: Sound;

  private async setCanvas(): Promise<void> {
    await this.canvas.requestPointerLock();
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
      const background = `radial-gradient(
                            circle at center,
                            transparent 0,
                            transparent 220px,
                            black 221px,
                            black 100%
                          )`;
      const backgroundImage = `url('/scope-overlay.png'),
                        radial-gradient(
                          circle at center,
                          transparent 0,
                          transparent 220px,
                          black 221px,
                          black 100%
                        )`;
      this.overlay.style.background = background;
      this.overlay.style.backgroundImage = backgroundImage;
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

  private handleFire(): void {
    if (this.gunLock) return;

    this.gunLock = true;
    this.gunSound.play();
    try {
      const cameraRay = this.camera?.getForwardRay(1000);
      if (!cameraRay) return;
      const pickingRayInfo = this.scene.pickWithRay(cameraRay);
      const name = pickingRayInfo?.pickedMesh?.name;
      if (!name) {
        return;
      }

      if (name.startsWith("decoy")) {
        this.radioChatSound.play();
        const decoyCollection = this.entityManager?.getDecoysCollection();
        if (!decoyCollection) {
          return;
        }

        const [e, idx] = name.split("-");
        const entityId = `${e}-${idx}`;
        const { entity } = decoyCollection.findBydId(entityId) || {};
        const decoyEntity = entity as DecoyEntity;
        if (!decoyEntity) {
          return;
        }
        decoyEntity.hit();
        setTimeout(() => {
          decoyCollection.disposeById(entityId);
        }, 10);
      }
    } finally {
      this.gunLock = false;
    }
  }

  private run_loop(): void {}

  public notify(context: TEvent): void {
    switch (context) {
      case "scope":
        this.handleScope();
        break;
      case "fire":
        this.handleFire();
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
    this.inputManager = new InputManager(this.scene);
    this.inputManager.subscribe(this);
    this.setupSky(this.scene);
  }
}
