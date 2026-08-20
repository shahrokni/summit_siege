import type { GroundMesh, Mesh, Scene } from "@babylonjs/core";
import { createGround } from "./ground";
import { createPyramid } from "./pyramid";

export type TMeshCollection = Partial<{
  ground: GroundMesh;
  pyramid: Array<Mesh>;
}>;

export const createEntities = (scene: Scene): TMeshCollection => {
  const meshCollection: TMeshCollection = {
    ground: undefined,
    pyramid: undefined,
  };

  const ground = createGround(scene);
  meshCollection.ground = ground;

  const pyramid = createPyramid(scene, ground);
  meshCollection.pyramid = pyramid;

  return meshCollection;
};
