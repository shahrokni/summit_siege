import {
  Color3,
  GroundMesh,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
} from "@babylonjs/core";

type Options = {
  size: number;
};
export const createPyramid = (scene: Scene, ground: GroundMesh): Mesh[] => {
  const gndBoundingBox = ground.getBoundingInfo().boundingBox;

  const gndLength =
    gndBoundingBox.maximumWorld.x - gndBoundingBox.minimumWorld.x;

  const FACTOR = 2;
  const CUBE_SIZE = 1;
  const GAP = 0.01;
  const pyramid: Mesh[] = [];
  const PYRAMID_BASE = gndLength / FACTOR;
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
        const box = MeshBuilder.CreateBox(`box-${i}.${j}`, boxOptions, scene);
        const shift = PYRAMID_BASE - currentPyramidBase / FACTOR;
        box.position.x = -1 * i * SPACING + gndLength / FACTOR - shift;
        box.position.y =
          (CUBE_SIZE / 2) * (PYRAMID_BASE - currentPyramidBase) + CUBE_SIZE / 2;
        box.position.z = j * SPACING - gndLength / FACTOR + shift;
        box.material = clayMat;
        pyramid.push(box);
      }
    }
    currentPyramidBase -= FACTOR;
  }

  return pyramid;
};
