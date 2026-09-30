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
} from "../../../../scene";
import { PyramidEntity } from "./pyramid";

export class PyramidEntityCollection
  extends EntityCollection<IEntity<Array<Mesh>>>
  implements IEntityCollection<IEntity<Array<Mesh>>>
{
  constructor(scene: Scene) {
    super(scene);
  }

  private id: string = "";

  public add(param: {
    position: TPosition;
    scale: number;
    rotation?: TRotation;
  }): string {
    if (this.id) {
      return this.id;
    }
    this.id = "pyramid";
    const meshes: Mesh[] = [];
    const instance = this.container?.instantiateModelsToScene();

    const material = new StandardMaterial("pyramidMaterial", this.scene);
    const texture = new Texture(
      "public/textures/ground007_1K/Ground007_1K-JPG_Color.jpg",
      this.scene,
    );

    texture.uScale = 20;
    texture.vScale = 20;
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

    const pyramid = new PyramidEntity(this.id, meshes, param.position);
    this.collection.push(pyramid);
    return this.id;
  }

  public async init(): Promise<void> {
    if (this.container) return;
    this.container = await LoadAssetContainerAsync(
      "public/models/pyramid/pyramid.obj",
      this.scene,
    );
  }
}
