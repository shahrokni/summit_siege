import { type GroundMesh, type Mesh, type Scene } from "@babylonjs/core";

import { PyramidEntity } from "./pyramid";
import { TrenchEntity } from "./trench";
import type { IEntity, IEntityManager } from "../../../scene";
import { GroundEntity } from "./ground";
import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic";

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
    this.scene = scene;
    registerBuiltInLoaders();
  }

  private meshCollection: TMeshCollection;
  private scene: Scene;

  public async init(): Promise<void> {
    const ground = new GroundEntity(this.scene, "ground");
    this.meshCollection.ground = ground;

    const pyramid = new PyramidEntity(
      this.scene,
      "pyramid",
      ground.getCubeLength(),
    );
    this.meshCollection.pyramid = pyramid;

    const trenches = new TrenchEntity(
      this.scene,
      "trench",
      ground.getCubeLength(),
    );
    this.meshCollection.trenches = trenches;
  }

  public dispose(): void {
    Object.keys(this.meshCollection).forEach((k) => {
      this.meshCollection[k as keyof TMeshCollection]?.dispose();
    });
  }
}
