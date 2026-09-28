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
import { CrateEntity } from "./crate";

export class CrateEntityCollection
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
    return `crate-${this.nextId}`;
  }

  public async init(): Promise<void> {
    if (this.container) return;
    this.container = await LoadAssetContainerAsync(
      "/models/crate/crate.obj",
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

    const material = new StandardMaterial("crate", this.scene);
    const texture = new Texture("/models/crate/crate.bmp", this.scene);
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
    const decoy = new CrateEntity(`${rootId}`, mesh!);
    this.collection.push(decoy);
    return rootId;
  }
}
