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
  height: 1;
  width: number;
  depth: number;
};

const FACTOR = 2;
const HEIGHT = 1;

export class PyramidEntity implements IEntity<Array<Mesh>> {
  constructor(scene: Scene, id: string, groundLength: number) {
    this.rootId = id;
    const pyramidBase = groundLength / FACTOR;
    this.pyramidBase = pyramidBase;
    let currentPyramidBase = pyramidBase;

    const clayMat = new StandardMaterial("clay", scene);
    clayMat.diffuseColor = Color3.FromHexString("#A66A3F");

    while (currentPyramidBase > 0) {
      const boxOptions: Options = {
        height: 1,
        width: currentPyramidBase,
        depth: currentPyramidBase,
      };
      const subId = `${this.rootId}-${currentPyramidBase}`;
      const box = MeshBuilder.CreateBox(subId, boxOptions, scene);
      this.subIds.push(subId);

      const x = 0;
      const y = (HEIGHT / 2) * (pyramidBase - currentPyramidBase) + HEIGHT / 2;
      const z = 0;

      box.position.x = x;
      box.position.y = y;
      box.position.z = z;

      this.positions.set(subId, { x, y, z });
      box.material = clayMat;
      this.pyramid.push(box);

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
