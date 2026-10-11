import type { Vector3 } from "@babylonjs/core";

/**
 * converts radian to degree
 * @param t is the radian angle
 * @returns calculated degree
 */
export const radToDeg = (t: number) => (t * 180) / Math.PI;

/**
 * converts degree to radian
 * @param t is the degree angle
 * @returns calculated radian
 */
export const degToRad = (t: number) => (t * Math.PI) / 180;

type TDirection = "NE" | "NW" | "SE" | "SW" | "N" | "E" | "W" | "S";

export type TPath = Array<{ p1: Vector3; p2: Vector3 }>;

const DIRECTION_TO_HEADING: Record<
  Extract<TDirection, "N" | "S" | "E" | "W">,
  number
> = {
  N: 90,
  S: 270,
  E: 0,
  W: 180,
};

const toHeading = (degrees: number, offset: number = 0): number =>
  parseFloat(degToRad(degrees).toFixed(2)) + offset;

/**
 * calculates the heading between two points
 * @param p1 start point
 * @param p2 end point
 * @param offset object offset angle (radian)
 * @returns heading in radian
 */
export const calculateHeading = (
  p1: Vector3,
  p2: Vector3,
  offset: number = 0,
): number => {
  const { x: sx, z: sz } = p1;
  const { x: ex, z: ez } = p2;
  const delta = { x: ex - sx, z: ez - sz };
  let direction: TDirection = "E";

  if (delta.x === 0 && delta.z === 0) {
    throw new Error(
      `undefined path between p1(${sx},${sz}) and p2(${ex},${ez})`,
    );
  } else if (delta.x > 0 && delta.z === 0) {
    direction = "W";
  } else if (delta.x < 0 && delta.z === 0) {
    direction = "E";
  } else if (delta.x === 0 && delta.z < 0) {
    direction = "N";
  } else if (delta.x === 0 && delta.z > 0) {
    direction = "S";
  } else if (delta.x < 0 && delta.z < 0) {
    direction = "NE";
  } else if (delta.x > 0 && delta.z < 0) {
    direction = "NW";
  } else if (delta.x < 0 && delta.z > 0) {
    direction = "SE";
  } else if (delta.x > 0 && delta.z > 0) {
    direction = "SW";
  }

  if (direction in DIRECTION_TO_HEADING) {
    return (
      parseFloat(
        degToRad(
          DIRECTION_TO_HEADING[direction as keyof typeof DIRECTION_TO_HEADING],
        ).toFixed(2),
      ) + offset
    );
  }

  const [oppThea, adjTheta] = ["NE", "NW", "SW"].includes(direction)
    ? [delta.z, delta.x]
    : [delta.x, delta.z];

  const theta = radToDeg(Math.atan(Math.abs(oppThea) / Math.abs(adjTheta)));
  if (direction === "NE") {
    return toHeading(theta, offset);
  } else if (direction === "NW") {
    return toHeading(180 - theta, offset);
  } else if (direction === "SW") {
    return toHeading(180 + theta, offset);
  } else {
    return toHeading(270 + theta, offset);
  }
};

/**
 * returns headings of a path
 * @param path is an array of point start and point end
 * @returns
 */
export const calculatePathHeadings = (
  path: TPath,
  offset: number = 0,
): number[] => {
  return path.map(({ p1, p2 }) => calculateHeading(p1, p2, offset));
};
