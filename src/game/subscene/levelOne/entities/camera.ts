import {
  AssetContainer,
  LoadAssetContainerAsync,
  Mesh,
  Ray,
  StandardMaterial,
  Texture,
  TransformNode,
  UniversalCamera,
  Vector3,
  type Scene,
} from "@babylonjs/core";
import type { TPlayerView } from "../state";

export class Camera {
  constructor(scene: Scene) {
    this.scene = scene;
  }

  private normalFov: number | undefined;
  private camera: UniversalCamera | undefined;
  private fovMap: Record<TPlayerView, number> | undefined;
  private scene: Scene;
  private container: AssetContainer | undefined;

  public async init(): Promise<void> {
    if (this.container) return;

    const camera = new UniversalCamera(
      "camera",
      new Vector3(0, 25, 65),
      this.scene,
    );
    this.normalFov = camera.fov;
    this.fovMap = {
      normal: this.normalFov,
      scope1: 0.5,
      scope2: 0.2,
    };
    camera.setTarget(Vector3.Zero());
    camera.rotation.x = 0;
    camera.attachControl();
    this.camera = camera;

    this.container = await LoadAssetContainerAsync(
      "/models/dragunov/dragunov.obj",
      this.scene,
    );

    const instance = this.container?.instantiateModelsToScene();
    if (!instance) return;

    const material = new StandardMaterial("dragunov", this.scene);
    const texture = new Texture("/models/dragunov/dragunov.png", this.scene);
    material.diffuseTexture = texture;

    const weaponHolder = new TransformNode("weaponHolder", this.scene);
    weaponHolder.parent = camera;
    weaponHolder.rotation.y = Math.PI * 0.38;
    weaponHolder.position.set(-0.1, -0.5, 1.28);
    camera.minZ = 0.2;
    weaponHolder.scaling.setAll(0.29);

    for (const root of instance.rootNodes) {
      root.parent = weaponHolder;
      if (root instanceof Mesh) {
        root.material = material;
      }
    }
  }

  public changeFov(view: TPlayerView): void {
    if (!this.camera) return;

    const fov = this.fovMap?.[view];

    if (fov === undefined) return;
    this.camera.fov = fov;
  }

  public getForwardRay(length: number): Ray {
    if (!this.camera) {
      throw new Error("camera is undefined");
    }

    return this.camera.getForwardRay(length);
  }

  public dispose() {
    this.camera?.dispose();
  }
}
