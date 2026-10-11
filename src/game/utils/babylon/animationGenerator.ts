import { Animation, Vector3 } from "@babylonjs/core";

type TKeyFrame = Array<{ frame: number; value: Vector3 | number }>;

export const generatePathAnimation = (
  entityId: string,
  path: Vector3[],
  speed: number = 2,
  frameRate: number = 60,
): { animation: Animation; keyFrames: number[] } => {
  if (path.length < 2) {
    throw new Error("Path must at least contain two points");
  }

  const positionAnimation = new Animation(
    `${entityId}-move`,
    "position",
    frameRate,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
  );

  /* TODO: add Y after the actual pyramid is added to the scene  */
  const positionKeys: TKeyFrame = [];

  let positionCurrentFrame = 0;
  for (let i = 0; i < path.length; i += 1) {
    const point = path[i];
    if (i > 0) {
      const previous = path[i - 1];
      const distance = Vector3.Distance(previous, point);
      positionCurrentFrame += (distance / speed) * frameRate;
    }
    positionKeys.push({
      frame: positionCurrentFrame,
      value: new Vector3(point.x, 1, point.z),
    });
  }
  positionAnimation.setKeys(positionKeys);

  return {
    animation: positionAnimation,
    keyFrames: positionKeys.map((pk) => pk.frame),
  };
};
