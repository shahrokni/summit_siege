import {
  Color3,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
} from "@babylonjs/core";
import type { IEntity } from "./entityManager";
import type { Position } from "../../../scene";

type Options = {
  size: number;
};

export class PyramidEntity implements IEntity<Array<Mesh>> {
  constructor(scene: Scene, id: string, groundLength: number) {
    this.id = id;
    // bugfix
    this.position = { x: 0, y: 0, z: 0 };
    const FACTOR = 2;
    const CUBE_SIZE = 1;
    const GAP = 0.01;
    const PYRAMID_BASE = groundLength / FACTOR;
    let currentPyramidBase = PYRAMID_BASE;
    const SPACING = CUBE_SIZE + GAP;

    const clayMat = new StandardMaterial("clay", scene);
    clayMat.diffuseColor = Color3.FromHexString("#A66A3F");

    while (currentPyramidBase > 0) {
      for (let i = 0; i < currentPyramidBase; i += 1) {
        for (let j = 0; j < currentPyramidBase; j += 1) {
          const boxOptions: Options = {
            size: CUBE_SIZE,
          };
          const box = MeshBuilder.CreateBox(
            `${id}-${i}.${j}`,
            boxOptions,
            scene,
          );
          const shift = PYRAMID_BASE - currentPyramidBase / FACTOR;
          box.position.x = -1 * i * SPACING + groundLength / FACTOR - shift;
          box.position.y =
            (CUBE_SIZE / 2) * (PYRAMID_BASE - currentPyramidBase) +
            CUBE_SIZE / 2;
          box.position.z = j * SPACING - groundLength / FACTOR + shift;
          box.material = clayMat;
          this.pyramid.push(box);
        }
      }
      currentPyramidBase -= FACTOR;
    }
  }

  private id: string;
  private position: Position;
  private pyramid: Mesh[] = [];

  public getId(): string {
    return this.id;
  }

  public getPosition(): Position {
    return this.position;
  }

  public getCubeLength(): number {
    // bugfix
    return 1;
  }

  public getMesh(): Mesh[] {
    return this.pyramid;
  }

  public dispose(): void {
    this.pyramid.forEach((c) => c.dispose());
  }
}
