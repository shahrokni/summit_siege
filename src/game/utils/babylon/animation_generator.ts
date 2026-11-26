import { Animation, Vector3 } from '@babylonjs/core';

import { sin } from '../math/trigonometry';

type TKeyFrame = Array<{ frame: number; value: Vector3 | number }>;

type TAnimation = { animation: Animation; keyFrames: number[] };

export const generatePathAnimation = (
  entityId: string,
  path: Vector3[],
  speed: number = 2,
  frameRate: number = 60,
): TAnimation => {
  if (path.length < 2) {
    throw new Error('Path must at least contain two points');
  }

  const positionAnimation = new Animation(
    `${entityId}-move`,
    'position',
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

export const generateGunRecoilAnimation = (
  entityId: string,
  duration: number,
  amplitude: number,
  property: 'rotation.x' | 'position.z' = 'rotation.x',
  initialValue: number = 0,
  frameRate: number = 60,
  exponent: number = 0.4,
): TAnimation => {
  if (duration <= 0 || duration >= 1) throw new Error('Duration must be between 0 and 1');

  const animation = new Animation(
    `${entityId}-recoil-${property}`,
    property,
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT,
  );

  const totalFrames = Math.max(1, Math.round(duration * frameRate));
  const keys: { frame: number; value: number }[] = [];

  for (let i = 0; i <= totalFrames; i += 1) {
    const t = i / totalFrames;
    keys.push({ frame: i, value: initialValue + sin(t, amplitude, Math.PI, 0, exponent) });
  }
  animation.setKeys(keys);

  return { animation, keyFrames: keys.map((key) => key.frame) };
};
