import {
  LoadAssetContainerAsync,
  Mesh,
  StandardMaterial,
  Texture,
  type Scene,
} from "@babylonjs/core";
import {
  EntityCollection,
  type IEntity,
  type IEntityCollection,
} from "../../scene/entity";

import type { TPosition, TRotation } from "../../scene/global";
import { BarrelEntity } from "./barrel";

export class BarrelEntityCollection
  extends EntityCollection<IEntity<Array<Mesh>>>
  implements IEntityCollection<IEntity<Array<Mesh>>>
{
  constructor(scene: Scene) {
    super(scene);
  }

  public async init(): Promise<void> {
    if (this.container) return;
    this.container = await LoadAssetContainerAsync(
      "/models/barrel/barrel.obj",
      this.scene,
    );
  }

  public add(param: {
    position: TPosition;
    scale: number;
    rotation?: TRotation;
  }): string {
    const rootId = `barrel-${this.getNextId()}`;
    const mesh: Array<Mesh> = [];
    const instance = this.container?.instantiateModelsToScene();

    const material = new StandardMaterial("barrel-material", this.scene);
    const texture = new Texture("/models/barrel/barrel.png", this.scene);

    material.diffuseTexture = texture;

    let cnt = 0;
    for (const m of instance?.rootNodes || []) {
      if (m instanceof Mesh) {
        m.name = `${rootId}-${cnt}`;
        m.id = `${rootId}-${cnt}`;
        m.position.set(param.position.x, param.position.y, param.position.z);
        m.scaling.setAll(param.scale);
        if (param.rotation) {
          m.rotation.x = param.rotation.x;
          m.rotation.y = param.rotation.y;
          m.rotation.z = param.rotation.z;
        }
        m.material = material;
        mesh.push(m);
        cnt += 1;
      }
    }
    const decoy = new BarrelEntity(`${rootId}`, mesh);
    this.collection.push(decoy);
    return rootId;
  }
}
