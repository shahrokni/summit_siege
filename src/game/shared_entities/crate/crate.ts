import type { Mesh } from "@babylonjs/core";
import type {
  IEntity,
  TEntityCubeLength,
  TEntityId,
  TEntityPosition,
  TPosition,
} from "../../scene";

export class CrateEntity implements IEntity<Mesh> {
  constructor(id: string, mesh: Mesh) {
    this.body = mesh;
    this.rootId = id;
  }

  private body: Mesh | undefined;
  private rootId: string;

  public getId(): TEntityId {
    return this.rootId;
  }
  public getPosition(): TEntityPosition {
    const { x, y, z } = this.body?.position as TPosition;
    return { x, y, z };
  }
  public getCubeLength(): TEntityCubeLength {
    throw new Error("");
  }
  public isComplex(): boolean {
    return Array.isArray(this.body);
  }
  public getMesh(): Mesh {
    return this.body!;
  }
  public dispose(): void {
    this.body?.dispose();
  }
}
