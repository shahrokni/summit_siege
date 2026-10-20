import type { Mesh, Scene, Vector3 } from "@babylonjs/core";
import type { IEntity, TEntityId, TEntityPosition } from "../../scene";
import { renderSparkEffect } from "../../utils/babylon/sparkEffect";
import { STD_ERR } from "../../scene/errors";

export class BarrelEntity implements IEntity<Array<Mesh>> {
  constructor(id: string, mesh: Array<Mesh>) {
    this.body = mesh;
    this.rootId = id;
    this.scene = this.body[0].getScene();
  }

  private body: Array<Mesh>;
  private rootId: string;
  private scene: Scene;

  public getId(): TEntityId {
    return this.rootId;
  }

  public getPosition(index: number = 0): TEntityPosition {
    if (index > this.body.length) {
      throw new Error(STD_ERR.index_out_of_range);
    }

    const { x, y, z } = this.body[index].position;
    return { x, y, z };
  }

  public getMesh(): Array<Mesh> {
    return this.body;
  }

  public hit(position: Vector3): void {
    const { x, y, z } = position;
    renderSparkEffect(this.scene, { x, y, z });
  }

  public dispose(): void {
    this.body.forEach((m) => m.dispose());
  }
}
