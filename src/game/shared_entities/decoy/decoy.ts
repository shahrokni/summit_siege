import { Mesh } from "@babylonjs/core";
import type {
  IEntity,
  TEntityCubeLength,
  TEntityId,
  TEntityPosition,
  TPosition,
} from "../../scene";

export class DecoyEntity implements IEntity<Array<Mesh>> {
  constructor(id: string, meshes: Array<Mesh>, position: TPosition) {
    this.body = meshes;
    this.rootId = id;
    this.position = position;
  }
  private body: Mesh[];
  private rootId: string;
  private position: TPosition;

  public getId(): TEntityId {
    return this.rootId;
  }

  public getPosition(): TEntityPosition {
    return this.position;
  }

  public getCubeLength(): TEntityCubeLength {
    throw new Error("TODO");
  }

  public isComplex(): boolean {
    return !!this.body.length;
  }

  public getMesh(): Mesh[] {
    return this.body;
  }

  dispose(): void {
    this.body.forEach((m) => m.dispose());
  }
}
