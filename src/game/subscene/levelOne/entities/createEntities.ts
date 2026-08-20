import type { GroundMesh, Mesh, Scene } from "@babylonjs/core";
import { createGround } from "./ground";
import { createPyramid } from "./pyramid";
import { createTrench } from "./trench";

export type TMeshCollection = Partial<{
  ground: GroundMesh;
  pyramid: Array<Mesh>;
  cylinders: Array<Mesh>;
}>;

export const createEntities = (scene: Scene): TMeshCollection => {
  const meshCollection: TMeshCollection = {
    ground: undefined,
    pyramid: undefined,
    cylinders: undefined,
  };

  const ground = createGround(scene);
  meshCollection.ground = ground;

  const pyramid = createPyramid(scene, ground);
  meshCollection.pyramid = pyramid;

  const cylinders = createTrench(scene, ground);
  meshCollection.cylinders = cylinders;

  return meshCollection;
};
