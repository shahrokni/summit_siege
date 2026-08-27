import { type GroundMesh, type Mesh, type Scene } from "@babylonjs/core";
import { PyramidEntity } from "./pyramid";
import type { IEntity, IEntityManager } from "../../../scene";
import { GroundEntity } from "./ground";
import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic";
import { DecoyEntityCollection } from "../../../shared_entities/decoy/decoyEnitytCollection";
import { PlatformEntityCollection } from "../../../shared_entities/platform/platformEntityCollection";

export type Entity = "ground" | "pyramid" | "trenches";

export type TEntityCollection = Partial<{
  ground: IEntity<GroundMesh>;
  pyramid: IEntity<Array<Mesh>>;
  platforms: PlatformEntityCollection;
  decoys: DecoyEntityCollection;
}>;

export class EntityManager implements IEntityManager {
  constructor(scene: Scene) {
    this.entityCollection = {
      ground: undefined,
      pyramid: undefined,
      platforms: undefined,
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

    const platformCollection = new PlatformEntityCollection(
      this.scene,
      ground.getCubeLength(),
    );
    this.entityCollection.platforms = platformCollection;
    await platformCollection.init();

    const decoyCollection = new DecoyEntityCollection(this.scene);
    this.entityCollection.decoys = decoyCollection;
    await decoyCollection.init();

    decoyCollection.add({
      position: { x: 18, y: 2, z: 18 },
      scale: 0.3,
      rotation: { y: 0, x: 0, z: 0 },
    });
  }

  public dispose(): void {
    Object.keys(this.entityCollection).forEach((k) => {
      this.entityCollection[k as keyof TEntityCollection]?.dispose();
    });
  }
}
