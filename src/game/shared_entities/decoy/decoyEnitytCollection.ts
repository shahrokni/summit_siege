import {
  AssetContainer,
  Color3,
  LoadAssetContainerAsync,
  Mesh,
  StandardMaterial,
  type Scene,
} from "@babylonjs/core";
import type {
  IEntity,
  IEntityCollection,
  TPosition,
  TRotation,
} from "../../scene";
import { DecoyEntity } from "./decoy";

export class DecoyEntityCollection implements IEntityCollection {
  constructor(scene: Scene) {
    this.scene = scene;
    this.nextId = -1;
  }

  private collection: Array<IEntity<Array<Mesh>>> = [];
  private container: AssetContainer | undefined;
  private scene: Scene;
  private nextId: number;

  private getNextId(): number {
    this.nextId += 1;
    return this.nextId;
  }

  private findBydId(
    entityId: string,
  ): { entity: IEntity<Array<Mesh>>; idx: number } | undefined {
    const entityIndex = this.collection.findIndex(
      (e) => e.getId() === entityId,
    );
    if (entityIndex == -1) return undefined;
    return { entity: this.collection[entityIndex], idx: entityIndex };
  }

  public async init(): Promise<void> {
    if (this.container) return;
    this.container = await LoadAssetContainerAsync(
      "/models/enemy_place_holder.obj",
      this.scene,
    );
  }

  public add(param: {
    position: TPosition;
    scale: number;
    rotation?: TRotation;
  }): void {
    const rootId = this.getNextId();
    const meshes: Mesh[] = [];
    const instance = this.container?.instantiateModelsToScene();
    const material = new StandardMaterial(`red-${rootId}`, this.scene);
    material.diffuseColor = new Color3(1, 0, 0);
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
    const decoy = new DecoyEntity(`${rootId}`, meshes, param.position);
    this.collection.push(decoy);
  }

  public disposeById(entityId: string): void {
    const response = this.findBydId(entityId);
    if (!response) {
      console.warn("No object found to dispose!");
      return;
    }
    const { entity, idx } = response;
    entity.dispose();
    this.collection.splice(idx, 1);
  }

  public dispose(): void {
    this.collection.forEach((e) => e.dispose());
    this.collection.splice(0, this.collection.length);
  }
}
