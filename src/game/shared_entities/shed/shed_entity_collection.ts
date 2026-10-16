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
import { ShedEntity } from "./shed";

export class ShedEntityCollection
  extends EntityCollection<IEntity<Array<Mesh>>>
  implements IEntityCollection<IEntity<Array<Mesh>>>
{
  constructor(scene: Scene) {
    super(scene);
  }

  public async init(): Promise<void> {
    if (this.container) return;
    this.container = await LoadAssetContainerAsync(
      "public/models/shed/shed.obj",
      this.scene,
    );
  }

  public add(param: {
    position: TPosition;
    scale: number;
    rotation?: TRotation;
  }): string {
    const rootId = `shed-${this.getNextId()}`;
    const meshes: Mesh[] = [];
    const instance = this.container?.instantiateModelsToScene();

    const material = new StandardMaterial("shed-material", this.scene);
    const texture = new Texture("public/models/shed/shed.png", this.scene);
    material.diffuseTexture = texture;

    let cnt = 0;
    for (const m of instance?.rootNodes || []) {
      if (m instanceof Mesh) {
        m.id = `${rootId}-${cnt}`;
        m.name = `${rootId}-${cnt}`;
        m.position.set(param.position.x, param.position.y, param.position.z);
        m.scaling.setAll(param.scale);
        if (param.rotation) {
          m.rotation.x = param.rotation.x;
          m.rotation.y = param.rotation.y;
          m.rotation.z = param.rotation.z;
        }
        m.material = material;
        meshes.push(m);
        cnt += 1;
      }
    }
    const shed = new ShedEntity(`${rootId}`, meshes);
    this.collection.push(shed);
    return rootId;
  }
}
