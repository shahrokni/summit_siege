import { Mesh, MeshBuilder, Scene } from "@babylonjs/core";
import type {
  IEntity,
  TEntityCubeLength,
  TEntityId,
  TEntityPosition,
  TPosition,
} from "../../../scene";

const DIAMETER = 2;

export class TrenchEntity implements IEntity<Array<Mesh>> {
  constructor(scene: Scene, id: string, groundLength: number) {
    this.rootId = id;
    const locations: Record<string, number[]> = {
      tl: [groundLength / 2, groundLength / -2, -4, 4],
      tr: [groundLength / -2, groundLength / -2, 4, 4],
      bl: [groundLength / 2, groundLength / 2, -4, -4],
      br: [groundLength / -2, groundLength / 2, 4, -4],
    };

    Object.keys(locations).forEach((k) => {
      const [x, z, ax, az] = locations[k];
      const options = {
        height: 1,
        diameter: DIAMETER,
      };
      const subId = `${id}-${k}`;
      const trench = MeshBuilder.CreateCylinder(subId, options, scene);
      this.subIds.push(subId);

      const _x = x + ax;
      const _z = z + az;
      const _y = 1;

      trench.position.x = _x;
      trench.position.z = _z;
      trench.position.y = _y;

      this.positions.set(subId, { x: _x, y: _y, z: _z });
      this.trenches.push(trench);
    });
  }

  isComplex(): boolean {
    return Array.isArray(this.trenches);
  }

  private rootId: string;
  private subIds: string[] = [];
  private trenches: Mesh[] = [];
  private positions: Map<string, TPosition> = new Map();

  public getId(): TEntityId {
    return { rootId: this.rootId, subIds: this.subIds };
  }
  public getPosition(): TEntityPosition {
    return this.positions;
  }

  getCubeLength(): TEntityCubeLength {
    return DIAMETER;
  }

  getMesh(): Mesh[] {
    return this.trenches;
  }
  dispose(): void {
    this.trenches.forEach((t) => t.dispose());
  }
}
