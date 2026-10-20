import {
  MeshBuilder,
  StandardMaterial,
  Texture,
  Vector3,
  type GroundMesh,
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
import { GroundEntity } from "./ground";

export class GroundEntityCollection
  extends EntityCollection<IEntity<Array<GroundMesh>>>
  implements IEntityCollection<IEntity<Array<GroundMesh>>>
{
  constructor(scene: Scene, length: number = 40) {
    super(scene);
    this.isInit = false;
    this.length = length;
  }

  private isInit: boolean;
  private length: number;

  public add(param: {
    position: TPosition;
    scale: number;
    rotation?: TRotation;
  }): string {
    if (this.getCollectionLength() === 1) {
      printStdWarn(
        [
          "src\\game\\subscene\\level_one\\entities\\ground\\ground_entity_collection.ts",
          "GroundEntityCollection",
          "add",
        ],
        "entity_limit_reached",
      );
      return this.getByIndex(0).getId();
    }
    const rootId = `ground-${this.getNextId()}`;

    const groundId = `${rootId}-base`;
    const groundExtensionId = `${rootId}-extension`;
    const mesh: Array<GroundMesh> = [];

    const ground = MeshBuilder.CreateGround(
      groundId,
      { width: this.length, height: this.length },
      this.scene,
    );

    const groundExtension = MeshBuilder.CreateGround(
      groundExtensionId,
      {
        width: this.length * 3,
        height: this.length * 3,
      },
      this.scene,
    );

    ground.scaling.setAll(param.scale);
    groundExtension.scaling.setAll(param.scale);
    ground.position = new Vector3(
      param.position.x,
      param.position.y,
      param.position.z,
    );

    groundExtension.position = new Vector3(
      param.position.x,
      param.position.y,
      param.position.z,
    );

    if (param.rotation) {
      ground.rotation = new Vector3(
        param.rotation.x,
        param.rotation.y,
        param.rotation.z,
      );
      groundExtension.rotation = new Vector3(
        param.rotation.x,
        param.rotation.y,
        param.rotation.z,
      );
    }

    const material = new StandardMaterial("groundMaterial", this.scene);
    const texture = new Texture(
      "public/textures/ground062S_1K/Ground062S_1K-JPG_Color.jpg",
      this.scene,
    );

    texture.uScale = 6;
    texture.vScale = 6;
    material.diffuseTexture = texture;
    groundExtension.material = material;

    const transparent = new StandardMaterial("transparent", this.scene);
    transparent.alpha = 0;
    ground.material = transparent;

    mesh.push(ground, groundExtension);
    const groundEntity = new GroundEntity(rootId, mesh);
    this.collection.push(groundEntity);
    return rootId;
  }

  public async init(): Promise<void> {
    if (this.isInit) {
      return;
    }
    this.isInit = true;
  }
}
