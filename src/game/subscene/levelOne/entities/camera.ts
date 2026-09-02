import { UniversalCamera, Vector3, type Scene } from "@babylonjs/core";
import type { TPlayerView } from "../state";

export class Camera {
  constructor(scene: Scene) {
    const camera = new UniversalCamera("camera", new Vector3(0, 25, 65), scene);
    this.normalFov = camera.fov;
    this.fovMap = {
      normal: this.normalFov,
      scope1: 0.5,
      scope2: 0.2,
    };
    camera.setTarget(Vector3.Zero());
    camera.rotation.x = 0;
    // Just for debug
    camera.attachControl();
    this.camera = camera;
  }

  private normalFov: number | undefined;
  private camera: UniversalCamera | undefined;
  private fovMap: Record<TPlayerView, number> | undefined;

  public changeFov(view: TPlayerView): void {
    if (!this.camera) return;

    const fov = this.fovMap?.[view];

    if (fov === undefined) return;
    this.camera.fov = fov;
  }

  public dispose() {
    this.camera?.dispose();
  }
}
