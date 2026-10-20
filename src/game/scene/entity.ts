import type {
  AssetContainer,
  GroundMesh,
  Mesh,
  RecastJSPlugin,
  Scene,
} from "@babylonjs/core";
import type { IDisposable, TPosition, TRotation } from "./global";
import { printStdWarn, STD_ERR } from "./errors";

export type TMesh = Array<GroundMesh> | Array<Mesh>;
export type TEntityPosition = TPosition | Map<string, TPosition>;
export type TEntityId = string;

export interface IEntityManager extends IDisposable {
  init: () => Promise<void>;
}

export interface IEntity<T extends TMesh> extends IDisposable {
  getId: () => TEntityId;
  getPosition: (index: number) => TEntityPosition;
  getMesh: () => T;
}

export class Entity<T extends TMesh> implements IEntity<T> {
  constructor(id: string, mesh: T) {
    this.rootId = id;
    this.body = mesh;
  }

  private rootId: string;
  private body: T;

  public getId(): TEntityId {
    return this.rootId;
  }

  getPosition(index: number): TEntityPosition {
    if (index > this.body.length) {
      throw new Error(STD_ERR.index_out_of_range);
    }

    const { x, y, z } = this.body[index].position;
    return { x, y, z };
  }

  public getMesh(): T {
    return this.body;
  }

  public dispose(): void {
    this.body.forEach((m) => m.dispose());
  }
}

export type TThinkTool = { computePath: RecastJSPlugin["computePath"] };

export type TThinkFN = (tools: TThinkTool) => void;

export interface IAgentEntity<T extends TMesh> extends IEntity<T> {
  think: TThinkFN;
}

export interface IEntityCollection<T> extends IDisposable {
  add: (param: {
    position: TPosition;
    scale: number;
    rotation?: TRotation;
  }) => string;
  init: () => Promise<void>;
  getBydId: (entityId: string) => { entity: T; idx: number } | undefined;
  getAll: () => T[];
  disposeById: (entityId: string) => void;
}

export class EntityCollection<T extends IEntity<TMesh>> {
  constructor(scene: Scene) {
    this.scene = scene;
  }

  private nextId = -1;
  protected scene: Scene;
  protected collection: Array<T> = [];
  protected container: AssetContainer | undefined;

  protected getNextId(): number {
    this.nextId += 1;
    return this.nextId;
  }

  public getBydId(entityId: string): { entity: T; idx: number } | undefined {
    const entityIndex = this.collection.findIndex(
      (e) => e.getId() === entityId,
    );
    console.log(this.collection, entityId, entityIndex);
    if (entityIndex == -1) return undefined;
    return { entity: this.collection[entityIndex], idx: entityIndex };
  }

  public getByIndex(index: number): T {
    if (index > this.collection.length - 1) {
      throw new Error(STD_ERR.index_out_of_range);
    }
    return this.collection[index];
  }

  public getAll(): T[] {
    return this.collection;
  }

  public getCollectionLength(): number {
    return this.collection.length;
  }

  public dispose(): void {
    this.collection.forEach((e) => e.dispose());
    this.collection.splice(0, this.collection.length);
  }

  public disposeById(entityId: string): void {
    const response = this.getBydId(entityId);
    if (!response) {
      printStdWarn(
        ["src\\game\\scene\\entity.ts", "EntityCollection", "disposeById"],
        "not_found",
      );
      return;
    }
    const { entity, idx } = response;
    entity.dispose();
    this.collection.splice(idx, 1);
  }
}
