import { Mesh, MeshBuilder, Scene, type GroundMesh } from "@babylonjs/core";

export const createTrench = (scene: Scene, ground: GroundMesh): Mesh[] => {
  const cylinders: Mesh[] = [];
  const gndBoundingBox = ground.getBoundingInfo().boundingBox;

  const gndLength =
    gndBoundingBox.maximumWorld.x - gndBoundingBox.minimumWorld.x;

  const locations: Record<string, number[]> = {
    tl: [gndLength / 2, gndLength / -2, -4, 4],
    tr: [gndLength / -2, gndLength / -2, 4, 4],
    bl: [gndLength / 2, gndLength / 2, -4, -4],
    br: [gndLength / -2, gndLength / 2, 4, -4],
  };

  Object.keys(locations).forEach((k) => {
    const [x, z, ax, az] = locations[k];
    const options = {
      height: 1,
      diameter: 2,
    };
    const trench = MeshBuilder.CreateCylinder(`trench-${k}`, options, scene);
    trench.position.x = x + ax;
    trench.position.z = z + az;
    trench.position.y = 1;
    cylinders.push(trench);
  });

  return cylinders;
};
