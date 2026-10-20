import type { Mesh } from "@babylonjs/core";
import { Entity, type IEntity } from "../../scene";

export class ShedEntity
  extends Entity<Array<Mesh>>
  implements IEntity<Array<Mesh>>
{
  constructor(id: string, meshes: Array<Mesh>) {
    super(id, meshes);
  }
}
