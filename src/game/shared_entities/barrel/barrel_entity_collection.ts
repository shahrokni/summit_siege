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
  extends EntityCollection<IEntity<Mesh>>
  implements IEntityCollection<IEntity<Mesh>>
{
  constructor(scene: Scene) {
    super(scene);
    this.nextId = -1;
  }

  private nextId: number;

  private getNextId(): string {
    this.nextId += 1;
    return `barrel-${this.nextId}`;
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
    const rootId = this.getNextId();
    let mesh: Mesh | undefined = undefined;
    const instance = this.container?.instantiateModelsToScene();

    const material = new StandardMaterial("barrel", this.scene);
    const texture = new Texture("/models/barrel/barrel.png", this.scene);
    material.diffuseTexture = texture;

    for (const m of instance?.rootNodes || []) {
      if (m instanceof Mesh) {
        m.name = `${rootId}`;
        m.id = `${rootId}`;
        m.position.set(param.position.x, param.position.y, param.position.z);
        m.scaling.setAll(param.scale);
        if (param.rotation) {
          m.rotation.x = param.rotation.x;
          m.rotation.y = param.rotation.y;
          m.rotation.z = param.rotation.z;
        }
        m.material = material;
        mesh = m;

        break;
      }
    }
    const decoy = new BarrelEntity(`${rootId}`, mesh!);
    this.collection.push(decoy);
    return rootId;
  }
}
