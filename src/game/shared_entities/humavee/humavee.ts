import { Mesh, Vector3 } from '@babylonjs/core';

import { Entity, type IEntity } from '../../scene';
import { renderSparkEffect } from '../../utils/babylon/sparkEffect';

export class HumaveeEntity extends Entity<Array<Mesh>> implements IEntity<Array<Mesh>> {
  constructor(id: string, meshes: Array<Mesh>) {
    super(id, meshes);
  }

  public hit(position: Vector3): void {
    const { x, y, z } = position;
    renderSparkEffect(this.scene, { x, y, z });
  }
}
