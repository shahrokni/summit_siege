import { Engine, Scene } from "@babylonjs/core";
import { LevelOne } from "../subscene";
import { State } from "../state";
import type { ILevel } from "../subscene/level";

export const createScene = (engine: Engine): Scene => {
  const scene = new Scene(engine);
  const state = new State("easy");

  // should be enabled when testing and debugging
  // createAxes(scene);

  /**
   * Levels have their specific setup
   * for instance, cameras, lights, scenarios, etc.
   */
  const level = state.getLevel();
  let levelInstance: ILevel | undefined;

  switch (level) {
    case 1:
      levelInstance = new LevelOne(scene, state.incrementLevel);
      break;
    default:
      levelInstance = new LevelOne(scene, state.incrementLevel);
  }

  if (!levelInstance) throw new Error("level instance is undefined");

  levelInstance.run();
  return scene;
};
