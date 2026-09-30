import type { Mesh, Scene, Vector3 } from "@babylonjs/core";
import type {
  IEntity,
  TEntityCubeLength,
  TEntityId,
  TEntityPosition,
  TPosition,
} from "../../scene";
import { renderSparkEffect } from "../../utils/babylon/sparkEffect";

export class BarrelEntity implements IEntity<Mesh> {
  constructor(id: string, mesh: Mesh) {
    this.body = mesh;
    this.rootId = id;
    this.scene = this.body.getScene();
  }

  private body: Mesh | undefined;
  private rootId: string;
  private scene: Scene;

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

  public hit(position: Vector3): void {
    const { x, y, z } = position;
    renderSparkEffect(this.scene, { x, y, z });
  }

  public dispose(): void {
    this.body?.dispose();
  }
}
