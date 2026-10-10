import { Vector3 } from "@babylonjs/core";
import { describe, expect, test, it } from "vitest";
import {
  calculateHeading,
  calculatePathHeadings,
  degToRad,
  type TPath,
} from "./trigonometry";

describe("trigonometry", () => {
  describe("headings", () => {
    const tests: Array<{ s: Vector3; e: Vector3; expected: number }> = [
      {
        s: new Vector3(0, 0, 0),
        e: new Vector3(2, 0, 0),
        expected: 180,
      },
      {
        s: new Vector3(0, 0, 0),
        e: new Vector3(-2, 0, 0),
        expected: 0,
      },
      {
        s: new Vector3(0, 0, 0),
        e: new Vector3(0, 0, -2),
        expected: 90,
      },
      {
        s: new Vector3(0, 0, 0),
        e: new Vector3(0, 0, 2),
        expected: 270,
      },
      {
        s: new Vector3(0, 0, 0),
        e: new Vector3(-2, 0, -2),
        expected: 45,
      },
      {
        s: new Vector3(0, 0, 0),
        e: new Vector3(2, 0, -2),
        expected: 135,
      },
      {
        s: new Vector3(0, 0, 0),
        e: new Vector3(2, 0, 2),
        expected: 225,
      },
      {
        s: new Vector3(0, 0, 0),
        e: new Vector3(-2, 0, 2),
        expected: 315,
      },
    ];

    tests.forEach(({ s, e, expected }) => {
      const fixedExpected = parseFloat(degToRad(expected).toFixed(2));
      test(`heading between p1(${s.x},${s.y},${s.z}) and p2(${e.x},${e.y},${e.z}) is ${expected}`, () => {
        expect(calculateHeading(s, e)).toBe(fixedExpected);
      });
    });
  });

  describe("path headings", () => {
    const path: TPath = [
      { p1: new Vector3(1, 0, -1), p2: new Vector3(0, 0, -2) },
      { p1: new Vector3(0, 0, -2), p2: new Vector3(1, 0, -3) },
      { p1: new Vector3(1, 0, -3), p2: new Vector3(-1, 0, -3) },
      { p1: new Vector3(-1, 0, -3), p2: new Vector3(0, 0, -2) },
      { p1: new Vector3(0, 0, -2), p2: new Vector3(-1, 0, -1) },
      { p1: new Vector3(-1, 0, -1), p2: new Vector3(-1, 0, 0) },
      { p1: new Vector3(-1, 0, 0), p2: new Vector3(1, 0, 0) },
      { p1: new Vector3(1, 0, 0), p2: new Vector3(1, 0, -1) },
    ];
    it("should return ", () => {
      expect(calculatePathHeadings(path)).toStrictEqual([
        0.79, 2.36, 0, 3.93, 5.5, 4.71, 3.14, 1.57,
      ]);
    });
  });
});
