import { ImportMeshAsync, type Scene } from "@babylonjs/core";
import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic";

export class EnemyPlaceHolder {
  constructor(scene: Scene) {
    this.scene = scene;
    registerBuiltInLoaders();
  }

  private scene: Scene;

  public async init(): Promise<void> {
    await ImportMeshAsync("/models/enemy_place_holder.obj", this.scene);
  }
}
