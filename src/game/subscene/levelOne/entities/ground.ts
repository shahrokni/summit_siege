import {
  Color3,
  GroundMesh,
  MeshBuilder,
  StandardMaterial,
  type Scene,
} from "@babylonjs/core";

export const createGround = (scene: Scene): GroundMesh => {
  const LENGTH = 40;
  const ground = MeshBuilder.CreateGround(
    "ground",
    { width: LENGTH, height: LENGTH },
    scene,
  );
  const material = new StandardMaterial("groundMaterial", scene);
  material.diffuseColor = Color3.FromHexString("#C7A66A");

  ground.material = material;
  return ground;
};
