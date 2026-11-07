import {
  FreeCamera,
  Vector3,
  type AssetContainer,
  type GroundMesh,
  type Mesh,
  type RecastJSPlugin,
  type Scene,
} from '@babylonjs/core';
import type { IDisposable, TPosition, TRotation } from './global';
import { printStdWarn, STD_ERR } from './errors';

export type TMesh = Array<GroundMesh> | Array<Mesh>;

export type TEntityPosition = TPosition | Map<string, TPosition>;

export type TEntityId = string;

export type TEntityCollection = Partial<{
  [id: string]: IEntityCollection<IEntity<TMesh>>;
}>;

export interface IEntityManager extends IDisposable {
  init: () => Promise<void>;
}

export type TAttachCameraParam = {
  index: number;
  margin: TPosition;
  target: TPosition;
};

export interface IEntity<T extends TMesh> extends IDisposable {
  getId: () => TEntityId;
  getPosition: (index: number) => TEntityPosition;
  getMesh: () => T;
  attachCamera: (params: TAttachCameraParam) => void;
  detachCamera: () => void;
}

export class Entity<T extends TMesh> implements IEntity<T> {
  constructor(id: string, mesh: T) {
    this.rootId = id;
    this.body = mesh;
    this.scene = mesh[0].getScene();
  }

  private rootId: string;
  private body: T;
  private bodyCamera: FreeCamera | undefined;
  private scene: Scene;

  public getId(): TEntityId {
    return this.rootId;
  }

  public getPosition(index: number): TEntityPosition {
    if (index >= this.body.length) {
      throw new Error(STD_ERR.index_out_of_range);
    }

    const { x, y, z } = this.body[index].position;
    return { x, y, z };
  }

  public getMesh(): T {
    return this.body;
  }

  public attachCamera(params: { index: number; margin: TPosition; target: TPosition }): void {
    const { index, margin, target } = params;
    if (index < 0 || index >= this.body.length || this.bodyCamera) return;

    const mesh = this.body[index];
    this.bodyCamera = new FreeCamera(`${this.rootId}-camera`, Vector3.Zero(), mesh.getScene());

    this.bodyCamera.parent = mesh;
    const { x, y, z } = margin;
    const { x: tx, y: ty, z: tz } = target;

    console.log({ x, y, z });
    console.log({ tx, ty, tz });

    this.bodyCamera.position.set(x, y, z);
    this.bodyCamera.setTarget(new Vector3(tx, ty, tz));
  }

  public detachCamera(): void {
    if (this.scene.activeCamera?.name === this.bodyCamera?.name) return;
    this.bodyCamera?.dispose();
    this.bodyCamera = undefined;
  }

  public dispose(): void {
    this.body.forEach((m) => m.dispose());
    this.bodyCamera?.dispose();
  }
}

export type TThinkTool = { computePath: RecastJSPlugin['computePath'] };

export type TThinkFN = (tools: TThinkTool) => void;

export interface IAgentEntity<T extends TMesh> extends IEntity<T> {
  think: TThinkFN;
}

export interface IAddParam {
  position: TPosition;
  scale: number;
  rotation?: TRotation;
}

export interface IEntityCollection<T> extends IDisposable {
  add: (param: IAddParam) => string;
  init: () => Promise<void>;
  getById: (param: { id: string }) => { entity: T; idx: number } | undefined;
  getAll: () => T[];
  getByIndex: (parm: { index: number }) => T;
  disposeById: (param: { id: string }) => void;
}

export class EntityCollection<T extends IEntity<TMesh>> implements IEntityCollection<T> {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public add(param: { position: TPosition; scale: number; rotation?: TRotation }): string {
    throw new Error(STD_ERR.must_be_implemented_by_child);
  }

  public async init(): Promise<void> {
    throw new Error(STD_ERR.must_be_implemented_by_child);
  }

  public getById(param: { id: string }): { entity: T; idx: number } | undefined {
    const entityIndex = this.collection.findIndex((e) => e.getId() === param.id);
    if (entityIndex == -1) return undefined;
    return { entity: this.collection[entityIndex], idx: entityIndex };
  }

  public getByIndex(param: { index: number }): T {
    if (param.index > this.collection.length - 1) {
      throw new Error(STD_ERR.index_out_of_range);
    }
    return this.collection[param.index];
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

  public disposeById(param: { id: string }): void {
    const response = this.getById(param);
    if (!response) {
      printStdWarn(['src\\game\\scene\\entity.ts', 'EntityCollection', 'disposeById'], 'not_found');
      return;
    }
    const { entity, idx } = response;
    entity.dispose();
    this.collection.splice(idx, 1);
  }
}
