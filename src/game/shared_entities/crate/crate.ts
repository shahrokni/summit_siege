import type { Mesh } from "@babylonjs/core";
import type { IEntity, TEntityId, TEntityPosition } from "../../scene";
import { STD_ERR } from "../../scene/errors";

export class CrateEntity implements IEntity<Array<Mesh>> {
  constructor(id: string, mesh: Array<Mesh>) {
    this.body = mesh;
    this.rootId = id;
  }

  private body: Array<Mesh>;
  private rootId: string;

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

  public dispose(): void {
    this.body.forEach((m) => m.dispose());
  }
}
