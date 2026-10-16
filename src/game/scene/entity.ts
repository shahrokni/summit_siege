import type {
  AssetContainer,
  GroundMesh,
  Mesh,
  RecastJSPlugin,
  Scene,
} from "@babylonjs/core";
import type { IDisposable, TPosition, TRotation } from "./global";
import { printStdWarn } from "./errors";

export type TMesh = GroundMesh | Array<Mesh>;
export type TEntityPosition = TPosition | Map<string, TPosition>;
export type TEntityId = string | { rootId: string; subIds: string[] };

export interface IEntityManager extends IDisposable {
  init: () => Promise<void>;
}

export interface IEntity<T extends TMesh> extends IDisposable {
  getId: () => TEntityId;
  getPosition: (index: number) => TEntityPosition;
  getMesh: () => T;
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
  findBydId: (entityId: string) => { entity: T; idx: number } | undefined;
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

  public findBydId(entityId: string): { entity: T; idx: number } | undefined {
    const entityIndex = this.collection.findIndex(
      (e) => e.getId() === entityId,
    );
    console.log(this.collection, entityId, entityIndex);
    if (entityIndex == -1) return undefined;
    return { entity: this.collection[entityIndex], idx: entityIndex };
  }

  public getAll(): T[] {
    return this.collection;
  }

  public dispose(): void {
    this.collection.forEach((e) => e.dispose());
    this.collection.splice(0, this.collection.length);
  }

  public disposeById(entityId: string): void {
    const response = this.findBydId(entityId);
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
