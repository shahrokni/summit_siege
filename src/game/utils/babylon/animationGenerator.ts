import { Animation, Vector3 } from "@babylonjs/core";

type TKeyFrame = Array<{ frame: number; value: Vector3 }>;

export const generatePathAnimation = (
  entityId: string,
  path: Vector3[],
  speed: number = 2,
  frameRate: number = 60,
): Animation => {
  if (path.length < 2) {
    throw new Error("Path must at least contain two points");
  }

  const animation = new Animation(
    `${entityId}-move`,
    "position",
    frameRate,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
  );

  let currentFrame = 0;
  /* TODO: add Y after the actual pyramid is added to the scene  */
  const keys: TKeyFrame = [
    { frame: 0, value: new Vector3(path[0].x, 1, path[0].z) },
  ];

  for (let i = 1; i < path.length; i += 1) {
    const prev = path[i - 1];
    const curr = path[i];
    const distance = Vector3.Distance(prev, curr);
    const durationSeconds = distance / speed;
    currentFrame += durationSeconds * frameRate;
    keys.push({
      frame: currentFrame,
      value: new Vector3(curr.x, 1, curr.z),
    });
  }
  animation.setKeys(keys);
  return animation;
};
