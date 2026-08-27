import { type GroundMesh, type Mesh, type Scene } from "@babylonjs/core";

import { PyramidEntity } from "./pyramid";
import { TrenchEntity } from "./trench";
import type { IEntity, IEntityManager } from "../../../scene";
import { GroundEntity } from "./ground";
import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic";
import { DecoyEntityCollection } from "../../../shared_entities/decoy/decoyEnitytCollection";

export type Entity = "ground" | "pyramid" | "trenches";

export type TEntityCollection = Partial<{
  ground: IEntity<GroundMesh>;
  pyramid: IEntity<Array<Mesh>>;
  trenches: IEntity<Array<Mesh>>;
  decoys: DecoyEntityCollection;
}>;

export class EntityManager implements IEntityManager {
  constructor(scene: Scene) {
    this.entityCollection = {
      ground: undefined,
      pyramid: undefined,
      trenches: undefined,
      decoys: undefined,
    };
    this.scene = scene;
    registerBuiltInLoaders();
  }

  private entityCollection: TEntityCollection;
  private scene: Scene;

  public async init(): Promise<void> {
    const ground = new GroundEntity(this.scene, "ground");
    this.entityCollection.ground = ground;

    const pyramid = new PyramidEntity(
      this.scene,
      "pyramid",
      ground.getCubeLength(),
    );
    this.entityCollection.pyramid = pyramid;

    const trenches = new TrenchEntity(
      this.scene,
      "trench",
      ground.getCubeLength(),
    );
    this.entityCollection.trenches = trenches;

    const decoyCollection = new DecoyEntityCollection(this.scene);
    this.entityCollection.decoys = decoyCollection;
    await decoyCollection.init();
  }

  public dispose(): void {
    Object.keys(this.entityCollection).forEach((k) => {
      this.entityCollection[k as keyof TEntityCollection]?.dispose();
    });
  }
}
