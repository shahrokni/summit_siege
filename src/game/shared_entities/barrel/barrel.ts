import type { Mesh, Scene, Vector3 } from "@babylonjs/core";
import { Entity, type IEntity } from "../../scene";
import { renderSparkEffect } from "../../utils/babylon/sparkEffect";

export class BarrelEntity
  extends Entity<Array<Mesh>>
  implements IEntity<Array<Mesh>>
{
  constructor(id: string, mesh: Array<Mesh>) {
    super(id, mesh);
    this.scene = mesh[0].getScene();
  }
  private scene: Scene;

  public hit(position: Vector3): void {
    const { x, y, z } = position;
    renderSparkEffect(this.scene, { x, y, z });
  }
}
