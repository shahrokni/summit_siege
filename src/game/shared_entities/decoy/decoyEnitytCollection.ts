import {
  Color3,
  LoadAssetContainerAsync,
  Mesh,
  StandardMaterial,
  type Scene,
} from "@babylonjs/core";
import {
  EntityCollection,
  type IEntity,
  type IEntityCollection,
} from "../../scene/entity";
import { DecoyEntity } from "./decoy";
import type { TPosition, TRotation } from "../../scene/global";

export class DecoyEntityCollection
  extends EntityCollection<IEntity<Array<Mesh>>>
  implements IEntityCollection
{
  constructor(scene: Scene) {
    super(scene);
    this.nextId = -1;
  }

  private nextId: number;

  private getNextId(): number {
    this.nextId += 1;
    return this.nextId;
  }

  public async init(): Promise<void> {
    if (this.container) return;
    this.container = await LoadAssetContainerAsync(
      "/models/enemy_place_holder.obj",
      this.scene,
    );
  }

  public add(param: {
    position: TPosition;
    scale: number;
    rotation?: TRotation;
  }): void {
    const rootId = this.getNextId();
    const meshes: Mesh[] = [];
    const instance = this.container?.instantiateModelsToScene();
    const material = new StandardMaterial(`red-${rootId}`, this.scene);
    material.diffuseColor = new Color3(1, 0, 0);
    for (const m of instance?.rootNodes || []) {
      if (m instanceof Mesh) {
        m.position.set(param.position.x, param.position.y, param.position.z);
        m.scaling.setAll(param.scale);
        if (param.rotation) {
          m.rotation.x = param.rotation.x;
          m.rotation.y = param.rotation.y;
          m.rotation.z = param.rotation.z;
        }
        m.material = material;
        meshes.push(m);
      }
    }
    const decoy = new DecoyEntity(`${rootId}`, meshes, param.position);
    this.collection.push(decoy);
  }
}
