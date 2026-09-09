import { type GroundMesh, type Mesh, type Scene } from "@babylonjs/core";
import { PyramidEntity } from "./pyramid";
import type { IEntity, IEntityManager, IIntelligent } from "../../../scene";
import { GroundEntity } from "./ground";
import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic";
import { DecoyEntityCollection } from "../../../shared_entities/decoy/decoyEnitytCollection";
import { PlatformEntityCollection } from "../../../shared_entities/platform/platformEntityCollection";
import { HumaveeEntityCollection } from "../../../shared_entities/humavee/humaveeEntityCollection";

export type Entity = "ground" | "pyramid" | "trenches";

export type TEntityCollection = Partial<{
  ground: IEntity<GroundMesh>;
  pyramid: IEntity<Array<Mesh>>;
  platforms: PlatformEntityCollection;
  decoys: DecoyEntityCollection;
  humavees: HumaveeEntityCollection;
}>;

export class EntityManager implements IEntityManager {
  constructor(scene: Scene) {
    this.entityCollection = {
      ground: undefined,
      pyramid: undefined,
      platforms: undefined,
      decoys: undefined,
      humavees: undefined,
    };
    this.scene = scene;
    registerBuiltInLoaders();
  }

  private entityCollection: TEntityCollection;
  private scene: Scene;

  public getDecoysCollection(): DecoyEntityCollection | undefined {
    return this.entityCollection.decoys;
  }

  public async init(): Promise<void> {
    const ground = new GroundEntity(this.scene, "ground");
    this.entityCollection.ground = ground;

    const pyramid = new PyramidEntity(
      this.scene,
      "pyramid",
      ground.getCubeLength(),
    );
    this.entityCollection.pyramid = pyramid;

    // const platformCollection = new PlatformEntityCollection(this.scene);
    // this.entityCollection.platforms = platformCollection;
    // await platformCollection.init();
    // platformCollection.add({
    //   position: { x: 25, y: 0, z: 18 },
    //   scale: 0.6,
    //   rotation: { z: 0, x: 0, y: Math.PI / -2 },
    // });

    /* TEST */
    const decoyCollection = new DecoyEntityCollection(this.scene);
    this.entityCollection.decoys = decoyCollection;
    await decoyCollection.init();

    const id = decoyCollection.add({
      position: { x: 25, y: 1, z: 18 },
      scale: 0.3,
      rotation: { y: 0, x: 0, z: 0 },
    });

    // TEST
    setInterval(() => {
      const intelligent = decoyCollection.findBydId(id)
        ?.entity as unknown as IIntelligent;
      intelligent.think();
    }, 1000);

    const humaveeCollection = new HumaveeEntityCollection(this.scene);
    this.entityCollection.humavees = humaveeCollection;
    await humaveeCollection.init();

    humaveeCollection.add({
      position: { x: 25, y: 0, z: 13 },
      scale: 1.5,
      rotation: { y: Math.PI / 2, x: 0, z: 0 },
    });
  }

  public dispose(): void {
    Object.keys(this.entityCollection).forEach((k) => {
      this.entityCollection[k as keyof TEntityCollection]?.dispose();
    });
  }
}
