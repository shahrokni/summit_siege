import { Animation, Vector3 } from "@babylonjs/core";

type TKeyFrame = Array<{ frame: number; value: Vector3 | number }>;

export const generatePathAnimation = (
  entityId: string,
  path: Vector3[],
  speed: number = 2,
  frameRate: number = 60,
): Animation[] => {
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

  const rotationAnimation = new Animation(
    `${entityId}-rotate`,
    "rotation.y",
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
  );

  /* TODO: add Y after the actual pyramid is added to the scene  */
  const positionKeys: TKeyFrame = [];
  const rotationKeys: TKeyFrame = [];
  let currentFrame = 0;

  for (let i = 0; i < path.length; i += 1) {
    const point = path[i];
    if (i > 0) {
      const previous = path[i - 1];
      const distance = Vector3.Distance(previous, point);
      currentFrame += (distance / speed) * frameRate;
    }
    positionKeys.push({
      frame: currentFrame,
      value: new Vector3(point.x, 1, point.z),
    });

    if (i < path.length - 1) {
      const next = path[i + 1];
      const direction = next.subtract(point);
      const angle = Math.atan2(direction.x, direction.y);
      rotationKeys.push({ frame: currentFrame, value: angle });
    }
  }

  positionAnimation.setKeys(positionKeys);
  rotationAnimation.setKeys(rotationKeys);
  return [positionAnimation, rotationAnimation];
};
