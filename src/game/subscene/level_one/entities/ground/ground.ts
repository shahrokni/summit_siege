import type { GroundMesh } from "@babylonjs/core";
import { Entity, type IEntity } from "../../../..";

export class GroundEntity
  extends Entity<Array<GroundMesh>>
  implements IEntity<Array<GroundMesh>>
{
  constructor(id: string, mesh: Array<GroundMesh>) {
    super(id, mesh);
  }
}
