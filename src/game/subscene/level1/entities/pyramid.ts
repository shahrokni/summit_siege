import { Mesh, MeshBuilder, Scene } from "@babylonjs/core";

type Options = {
  size: number;
};
export const createPyramid = (scene: Scene): Mesh[] => {
  const CUBE_SIZE = 1;
  const GAP = 0.05;
  const pyramid: Mesh[] = [];
  const PYRAMID_BASE = 12;
  let currentPyramidBase = PYRAMID_BASE; /* 8*8 */
  const SPACING = CUBE_SIZE + GAP;

  while (currentPyramidBase != 0) {
    for (let i = 0; i < currentPyramidBase; i += 1) {
      for (let j = 0; j < currentPyramidBase; j += 1) {
        const boxOptions: Options = {
          size: CUBE_SIZE,
        };
        const box = MeshBuilder.CreateBox("box", boxOptions, scene);
        box.position.x = i * SPACING;
        box.position.y = (CUBE_SIZE / 2) * (PYRAMID_BASE - currentPyramidBase);
        box.position.z = j * SPACING;
        pyramid.push(box);
      }
    }
    currentPyramidBase -= 2;
  }

  return pyramid;
};
