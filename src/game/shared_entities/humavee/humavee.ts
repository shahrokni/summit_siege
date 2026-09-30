import { Mesh, Scene, Vector3 } from "@babylonjs/core";
import type {
  IEntity,
  TEntityCubeLength,
  TEntityId,
  TEntityPosition,
  TPosition,
} from "../../scene";
import { renderSparkEffect } from "../../utils/babylon/sparkEffect";

export class HumaveeEntity implements IEntity<Array<Mesh>> {
  constructor(id: string, meshes: Array<Mesh>, position: TPosition) {
    this.body = meshes;
    this.rootId = id;
    this.position = position;
    this.scene = this.body[0].getScene();
  }
  private body: Mesh[];
  private rootId: string;
  private position: TPosition;
  private scene: Scene;

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

  public hit(position: Vector3): void {
    const { x, y, z } = position;
    renderSparkEffect(this.scene, { x, y, z });
  }

  dispose(): void {
    this.body.forEach((m) => m.dispose());
  }
}
