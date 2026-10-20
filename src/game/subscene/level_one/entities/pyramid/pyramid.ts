import type { Mesh } from "@babylonjs/core";
import type { IEntity, TEntityId, TEntityPosition } from "../../../../scene";
import { STD_ERR } from "../../../../scene/errors";

export class PyramidEntity implements IEntity<Array<Mesh>> {
  constructor(id: string, mesh: Array<Mesh>) {
    this.rootId = id;
    this.body = mesh;
  }

  private rootId: string;
  private body: Mesh[];

  public getId(): TEntityId {
    return this.rootId;
  }

  public getPosition(index: number): TEntityPosition {
    if (index > this.body.length) {
      throw new Error(STD_ERR.index_out_of_range);
    }

    const { x, y, z } = this.body[index].position;
    return { x, y, z };
  }
  public getMesh(): Mesh[] {
    return this.body;
  }

  public dispose(): void {
    this.body.forEach((m) => m.dispose());
  }
}
