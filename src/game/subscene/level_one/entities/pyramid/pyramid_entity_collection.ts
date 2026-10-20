import {
  MeshBuilder,
  StandardMaterial,
  Texture,
  type Mesh,
  type Scene,
} from "@babylonjs/core";
import {
  EntityCollection,
  type IEntity,
  type IEntityCollection,
  type TPosition,
  type TRotation,
} from "../../../../scene";
import { printStdWarn } from "../../../../scene/errors";
import { PyramidEntity } from "./pyramid";

type Options = {
  height: 1;
  width: number;
  depth: number;
};

const FACTOR = 2;
const HEIGHT = 1;

export class PyramidEntityCollection
  extends EntityCollection<IEntity<Array<Mesh>>>
  implements IEntityCollection<IEntity<Array<Mesh>>>
{
  constructor(scene: Scene, length: number) {
    super(scene);
    this.length = length;
    this.isInit = false;
  }

  private length: number;
  private isInit: boolean;

  public add(param: {
    position: TPosition;
    scale: number;
    rotation?: TRotation;
  }): string {
    if (this.getCollectionLength() === 1) {
      printStdWarn(
        [
          "src\\game\\subscene\\level_one\\entities\\pyramid\\pyramid_entity_collection.ts",
          "PyramidEntityCollection",
          "add",
        ],
        "entity_limit_reached",
      );
      return this.getByIndex(0).getId();
    }
    const rootId = `pyramid-${this.getNextId()}`;
    const base = this.length;
    let currentBase = base;
    const mesh: Mesh[] = [];

    const material = new StandardMaterial("pyramid-material", this.scene);
    const texture = new Texture(
      "public/textures/ground007_1K/Ground007_1K-JPG_Color.jpg",
      this.scene,
    );

    texture.uScale = 6;
    texture.vScale = 6;
    material.diffuseTexture = texture;

    while (currentBase > 0) {
      const boxOptions: Options = {
        height: HEIGHT,
        width: currentBase,
        depth: currentBase,
      };
      const subId = `${rootId}-${currentBase}`;
      const box = MeshBuilder.CreateBox(subId, boxOptions, this.scene);

      const x = param.position.x;
      const y = (HEIGHT / 2) * (base - currentBase) + HEIGHT / 2;
      const z = param.position.z;

      box.position.x = x;
      box.position.y = y;
      box.position.z = z;
      box.scaling.setAll(param.scale);

      box.material = material;
      mesh.push(box);

      currentBase -= FACTOR;
    }

    const pyramidEntity = new PyramidEntity(rootId, mesh);
    this.collection.push(pyramidEntity);
    return rootId;
  }
  public async init(): Promise<void> {
    if (this.isInit) {
      return;
    }
    this.isInit = true;
  }
}
