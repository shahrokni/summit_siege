import { Mesh, MeshBuilder, Scene } from "@babylonjs/core";
import type { IEntity } from "./entityManager";
import type { Position } from "../../../scene";

export class TrenchEntity implements IEntity<Array<Mesh>> {
  constructor(scene: Scene, id: string, groundLength: number) {
    this.id = id;
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
        diameter: 2,
      };
      const trench = MeshBuilder.CreateCylinder(`${id}-${k}`, options, scene);
      trench.position.x = x + ax;
      trench.position.z = z + az;
      trench.position.y = 1;
      this.trenches.push(trench);
    });
  }

  private id: string;
  private trenches: Mesh[] = [];

  public getId(): string {
    return this.id;
  }
  public getPosition(): Position {
    // bugfix
    return { x: 0, y: 0, z: 0 };
  }
  getCubeLength(): number {
    // bugfix
    return 1;
  }

  getMesh(): Mesh[] {
    return this.trenches;
  }
  dispose(): void {
    this.trenches.forEach((t) => t.dispose());
  }
}
