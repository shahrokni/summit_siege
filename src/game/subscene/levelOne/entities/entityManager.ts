import {
  Color3,
  RecastJSPlugin,
  StandardMaterial,
  type GroundMesh,
  type Mesh,
  type Scene,
} from "@babylonjs/core";
import { SimplePyramidEntity } from "./simple_pyramid/simple_pyramid";
import {
  EntityCollection,
  type IEntity,
  type IEntityManager,
  type TThinkFN,
  type TThinkTool,
} from "../../../scene";
import { GroundEntity } from "./ground/ground";
import { DecoyEntityCollection } from "../../../shared_entities/decoy/decoy_enityt_collection";
import { HumaveeEntityCollection } from "../../../shared_entities/humavee/humavee_entity_collection";
import Recast from "recast-detour";
import { CrateEntityCollection } from "../../../shared_entities/crate/crateEntityCollection";
import { BarrelEntityCollection } from "../../../shared_entities/barrel/barrel_entity_collection";
import { ShedEntityCollection } from "../../../shared_entities/shed/shed_entity_collection";

const THINK_INTERVAL_MS = 3000;
export type Entity = "ground" | "pyramid" | "trenches";

export type TEntityCollection = Partial<{
  ground: IEntity<Array<GroundMesh>>;
  pyramid: IEntity<Array<Mesh>>;
  decoys: DecoyEntityCollection;
  humavees: HumaveeEntityCollection;
  barrels: BarrelEntityCollection;
}>;

export class EntityManager implements IEntityManager {
  constructor(scene: Scene) {
    this.entityCollection = {
      ground: undefined,
      pyramid: undefined,
      decoys: undefined,
      humavees: undefined,
    };
    this.scene = scene;
  }

  private entityCollection: TEntityCollection;
  private scene: Scene;
  private navigationPlugin: RecastJSPlugin | undefined;
  private intervalId: number = -1;
  private thinkToolSet: TThinkTool | undefined;

  private createEnv(): void {
    const ground = new GroundEntity(this.scene, "ground");
    this.entityCollection.ground = ground;

    const pyramid = new SimplePyramidEntity(
      this.scene,
      "pyramid",
      ground.getCubeLength(),
    );
    this.entityCollection.pyramid = pyramid;
  }

  private async createNavMesh(debugMode: boolean = false): Promise<void> {
    const recast = await Recast();
    this.navigationPlugin = new RecastJSPlugin(recast);
    const grounds = this.entityCollection.ground!.getMesh();
    this.navigationPlugin.createNavMesh(
      [grounds[0], grounds[1], ...this.entityCollection.pyramid!.getMesh()],
      {
        cs: 0.2,
        ch: 0.2,
        walkableSlopeAngle: 35,
        walkableHeight: 1,
        walkableClimb: 1,
        walkableRadius: 1,
        maxEdgeLen: 12,
        maxSimplificationError: 1.3,
        minRegionArea: 8,
        mergeRegionArea: 20,
        maxVertsPerPoly: 6,
        detailSampleDist: 6,
        detailSampleMaxError: 1,
      },
    );

    if (debugMode) {
      const navMeshDebug = this.navigationPlugin.createDebugNavMesh(this.scene);
      const matDebug = new StandardMaterial("matdebug", this.scene);
      matDebug.diffuseColor = new Color3(0.1, 0.2, 1);
      matDebug.alpha = 0.5;
      navMeshDebug.material = matDebug;
    }
    this.thinkToolSet = {
      computePath: this.navigationPlugin.computePath.bind(
        this.navigationPlugin,
      ),
    };
  }

  private provokeThink(): void {
    for (const key in this.entityCollection) {
      const entityKey = key as keyof TEntityCollection;
      const entityCollection = this.entityCollection[entityKey];
      if (entityCollection instanceof EntityCollection) {
        entityCollection.getAll().map((entity) => {
          if ("think" in entity) {
            if (this.thinkToolSet) {
              (entity.think as TThinkFN)?.(this.thinkToolSet);
            }
          }
        });
      }
    }
  }

  public getCollection(
    name: keyof TEntityCollection,
  ): TEntityCollection[keyof TEntityCollection] | undefined {
    return this.entityCollection[name];
  }

  public async init(): Promise<void> {
    this.createEnv();
    /* -- */

    const crateCollection = new CrateEntityCollection(this.scene);
    await crateCollection.init();
    crateCollection.add({
      position: { x: 32, y: 0, z: 19 },
      scale: 1,
      rotation: { y: Math.PI * 2, x: 0, z: 0 },
    });

    await this.createNavMesh(false);

    /* decoy */
    const decoyCollection = new DecoyEntityCollection(this.scene);
    this.entityCollection.decoys = decoyCollection;
    await decoyCollection.init();

    decoyCollection.add({
      position: { x: 25, y: 1, z: 2 },
      scale: 0.3,
      rotation: { y: 0, x: 0, z: 0 },
    });

    decoyCollection.add({
      position: { x: 28, y: 1, z: -2 },
      scale: 0.3,
      rotation: { y: 0, x: 0, z: 0 },
    });

    /* humavee */

    const humaveeCollection = new HumaveeEntityCollection(this.scene);
    this.entityCollection.humavees = humaveeCollection;
    await humaveeCollection.init();

    humaveeCollection.add({
      position: { x: 28, y: 0, z: 13 },
      scale: 1.5,
      rotation: { y: Math.PI * 2, x: 0, z: 0 },
    });

    /* barrel */
    const barrelCollection = new BarrelEntityCollection(this.scene);
    this.entityCollection.barrels = barrelCollection;
    await barrelCollection.init();
    barrelCollection.add({
      position: { x: 33, y: 0, z: 16 },
      scale: 1,
    });

    /* shed */
    const shedCollection = new ShedEntityCollection(this.scene);
    await shedCollection.init();
    shedCollection.add({
      position: { x: 33, y: 0, z: 28 },
      scale: 1,
    });

    this.intervalId = setInterval(
      this.provokeThink.bind(this),
      THINK_INTERVAL_MS,
    );
  }

  public dispose(): void {
    clearInterval(this.intervalId);
    Object.keys(this.entityCollection).forEach((k) => {
      this.entityCollection[k as keyof TEntityCollection]?.dispose();
    });
  }
}
