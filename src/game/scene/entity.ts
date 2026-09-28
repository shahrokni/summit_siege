import type {
  AssetContainer,
  GroundMesh,
  Mesh,
  RecastJSPlugin,
  Scene,
} from "@babylonjs/core";
import type { TPosition, TRotation } from "./global";

export type TMesh = GroundMesh | Array<Mesh> | Mesh;
export type TEntityCubeLength =
  | number
  | { width: number; height: number; depth: number };
export type TEntityPosition = TPosition | Map<string, TPosition>;
export type TEntityId = string | { rootId: string; subIds: string[] };

export interface IEntityManager {
  init: () => Promise<void>;
  dispose: () => void;
}

export interface IEntity<T extends TMesh> {
  getId: () => TEntityId;
  getPosition: () => TEntityPosition;
  getCubeLength: () => TEntityCubeLength;
  isComplex: () => boolean;
  getMesh: () => T;
  dispose: () => void;
}

export type TThinkTool = { computePath: RecastJSPlugin["computePath"] };
export type TThinkFN = (tools: TThinkTool) => void;

export interface IAgentEntity<T extends TMesh> extends IEntity<T> {
  think: TThinkFN;
}

export interface IEntityCollection<T> {
  add: (param: {
    position: TPosition;
    scale: number;
    rotation?: TRotation;
  }) => string;
  init: () => Promise<void>;
  findBydId: (entityId: string) => { entity: T; idx: number } | undefined;
  getAll: () => T[];
  dispose: () => void;
  disposeById: (entityId: string) => void;
}

export class EntityCollection<T extends IEntity<TMesh>> {
  constructor(scene: Scene) {
    this.scene = scene;
  }

  protected scene: Scene;
  protected collection: Array<T> = [];
  protected container: AssetContainer | undefined;

  public findBydId(entityId: string): { entity: T; idx: number } | undefined {
    const entityIndex = this.collection.findIndex(
      (e) => e.getId() === entityId,
    );
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
      console.warn("No object found to dispose!");
      return;
    }
    const { entity, idx } = response;
    entity.dispose();
    this.collection.splice(idx, 1);
  }
}
