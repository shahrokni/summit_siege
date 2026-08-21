import {
  Color3,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
} from "@babylonjs/core";
import type {
  IEntity,
  TEntityCubeLength,
  TEntityId,
  TEntityPosition,
  TPosition,
} from "../../../scene";

type Options = {
  size: number;
};

export class PyramidEntity implements IEntity<Array<Mesh>> {
  constructor(scene: Scene, id: string, groundLength: number) {
    this.rootId = id;
    const FACTOR = 2;
    const CUBE_SIZE = 1;
    const GAP = 0.01;
    const PYRAMID_BASE = groundLength / FACTOR;
    this.pyramidBase = PYRAMID_BASE;
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
          const subId = `${this.rootId}-${i}.${j}`;
          const box = MeshBuilder.CreateBox(subId, boxOptions, scene);
          this.subIds.push(subId);
          const shift = PYRAMID_BASE - currentPyramidBase / FACTOR;

          const x = -1 * i * SPACING + groundLength / FACTOR - shift;
          const y =
            (CUBE_SIZE / 2) * (PYRAMID_BASE - currentPyramidBase) +
            CUBE_SIZE / 2;
          const z = j * SPACING - groundLength / FACTOR + shift;

          box.position.x = x;
          box.position.y = y;
          box.position.z = z;

          this.positions.set(subId, { x, y, z });

          box.material = clayMat;
          this.pyramid.push(box);
        }
      }
      currentPyramidBase -= FACTOR;
    }
  }

  isComplex(): boolean {
    return Array.isArray(this.pyramid);
  }

  private rootId: string;
  private subIds: string[] = [];
  private positions: Map<string, TPosition> = new Map();
  private pyramid: Mesh[] = [];
  private pyramidBase: number | undefined;

  public getId(): TEntityId {
    return { rootId: this.rootId, subIds: this.subIds };
  }

  public getPosition(): TEntityPosition {
    return this.positions;
  }

  public getCubeLength(): TEntityCubeLength {
    const base = this.pyramidBase as number;
    // bugfix, either depth or hight should be calculated manually
    return {
      width: base,
      height: base,
      depth: base,
    };
  }

  public getMesh(): Mesh[] {
    return this.pyramid;
  }

  public dispose(): void {
    this.pyramid.forEach((c) => c.dispose());
  }
}
