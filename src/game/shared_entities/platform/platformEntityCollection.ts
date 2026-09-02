import {
  LoadAssetContainerAsync,
  Mesh,
  StandardMaterial,
  Texture,
  type Scene,
} from "@babylonjs/core";
import type { TPosition, TRotation } from "../../scene";
import {
  EntityCollection,
  type IEntity,
  type IEntityCollection,
} from "../../scene/entity";
import { PlatformEntity } from "./platform";

export class PlatformEntityCollection
  extends EntityCollection<IEntity<Array<Mesh>>>
  implements IEntityCollection
{
  constructor(scene: Scene) {
    super(scene);
  }

  public add(param: {
    position: TPosition;
    scale: number;
    rotation?: TRotation;
  }): void {
    const {
      position: { x, y, z },
      rotation,
      scale,
    } = param;
    const material = new StandardMaterial("metalMaterial", this.scene);
    const texture = new Texture(
      "public/textures/metal053C_1K/Metal053C_1K-JPG_Color.jpg",
      this.scene,
    );
    material.diffuseTexture = texture;
    const instance = this.container?.instantiateModelsToScene();

    const meshes: Mesh[] = [];

    for (const m of instance?.rootNodes || []) {
      if (m instanceof Mesh) {
        m.position.set(x, y, z);
        m.rotation.y = rotation?.y || 0;
        m.scaling.setAll(scale);
        m.material = material;
        meshes.push(m);
      }
    }

    const platform = new PlatformEntity("platform", meshes, {
      x,
      y,
      z,
    });
    this.collection.push(platform);
  }

  public async init(): Promise<void> {
    if (this.container) return;
    this.container = await LoadAssetContainerAsync(
      "/models/platform1.obj",
      this.scene,
    );
  }
}
