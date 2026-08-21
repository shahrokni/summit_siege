import type { GroundMesh, Mesh, Scene } from "@babylonjs/core";

import { PyramidEntity } from "./pyramid";
import { TrenchEntity } from "./trench";
import type { IEntity } from "../../../scene";
import { GroundEntity } from "./ground";

export type Entity = "ground" | "pyramid" | "trenches";

export type TMeshCollection = Partial<{
  ground: IEntity<GroundMesh>;
  pyramid: IEntity<Array<Mesh>>;
  trenches: IEntity<Array<Mesh>>;
}>;

export class EntityManager {
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

    const cylinders = new TrenchEntity(scene, "trench", ground.getCubeLength());
    this.meshCollection.trenches = cylinders;
  }

  private meshCollection: TMeshCollection;
}
