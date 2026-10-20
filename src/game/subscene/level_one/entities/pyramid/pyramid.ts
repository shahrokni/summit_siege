import type { Mesh } from "@babylonjs/core";
import { Entity, type IEntity } from "../../../../scene";

export class PyramidEntity
  extends Entity<Array<Mesh>>
  implements IEntity<Array<Mesh>>
{
  constructor(id: string, mesh: Array<Mesh>) {
    super(id, mesh);
  }
}
