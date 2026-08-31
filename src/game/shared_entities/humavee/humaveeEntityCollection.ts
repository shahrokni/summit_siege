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
  type TPosition,
  type TRotation,
} from "../../scene";
import { HumaveeEntity } from "./humavee";

export class HumaveeEntityCollection
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
      "public/models/humavee/humvee.obj",
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

    const material = new StandardMaterial("texture", this.scene);
    const texture = new Texture(
      "public/models/humavee/humavee.jpg",
      this.scene,
    );
    material.diffuseTexture = texture;

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
    const decoy = new HumaveeEntity(`${rootId}`, meshes, param.position);
    this.collection.push(decoy);
  }
}
