import type { Mesh } from "@babylonjs/core";
import type {
  IEntity,
  TEntityCubeLength,
  TEntityId,
  TEntityPosition,
  TPosition,
} from "../../scene";

export class PlatformEntity implements IEntity<Array<Mesh>> {
  constructor(id: string, meshes: Array<Mesh>, position: TPosition) {
    this.platform = meshes;
    this.rootId = id;
    this.position = position;
  }
  private platform: Mesh[];
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
    return !!this.platform.length;
  }

  public getMesh(): Mesh[] {
    return this.platform;
  }

  dispose(): void {
    this.platform.forEach((m) => m.dispose());
  }
}
