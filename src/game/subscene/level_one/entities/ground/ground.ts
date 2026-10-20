import type { GroundMesh } from "@babylonjs/core";
import type { IEntity, TEntityId, TEntityPosition } from "../../../..";
import { STD_ERR } from "../../../../scene/errors";

export class GroundEntity implements IEntity<Array<GroundMesh>> {
  constructor(id: string, mesh: Array<GroundMesh>) {
    this.rootId = id;
    this.body = mesh;
  }

  private body: Array<GroundMesh>;
  private rootId: string;

  public getId(): TEntityId {
    return this.rootId;
  }

  getPosition(index: number): TEntityPosition {
    if (index > this.body.length) {
      throw new Error(STD_ERR.index_out_of_range);
    }

    const { x, y, z } = this.body[index].position;
    return { x, y, z };
  }

  public getMesh(): GroundMesh[] {
    return this.body;
  }

  public dispose(): void {
    this.body.forEach((m) => m.dispose());
  }
}
