import type { GroundMesh, Mesh, Scene } from "@babylonjs/core";

import { PyramidEntity } from "./pyramid";
import { TrenchEntity } from "./trench";
import type { IEntity, IEntityManager } from "../../../scene";
import { GroundEntity } from "./ground";

export type Entity = "ground" | "pyramid" | "trenches";

export type TMeshCollection = Partial<{
  ground: IEntity<GroundMesh>;
  pyramid: IEntity<Array<Mesh>>;
  trenches: IEntity<Array<Mesh>>;
}>;

export class EntityManager implements IEntityManager {
  constructor(scene: Scene) {
    this.meshCollection = {
      ground: undefined,
      pyramid: undefined,
      trenches: undefined,
    };
    const ground = new GroundEntity(scene, "ground");
    this.meshCollection.ground = ground;

    const pyramid = new PyramidEntity(scene, "pyramid", ground.getCubeLength());
    this.meshCollection.pyramid = pyramid;

    const trenches = new TrenchEntity(scene, "trench", ground.getCubeLength());
    this.meshCollection.trenches = trenches;
  }

  private meshCollection: TMeshCollection;

  public dispose(): void {
    Object.keys(this.meshCollection).forEach((k) => {
      this.meshCollection[k as keyof TMeshCollection]?.dispose();
    });
  }
}
