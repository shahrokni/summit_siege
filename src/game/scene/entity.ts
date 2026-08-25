import type { GroundMesh, Mesh } from "@babylonjs/core";
import type { TPosition } from "./global";

export type TMesh = GroundMesh | Array<Mesh>;
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
