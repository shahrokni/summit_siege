/* eslint-disable @typescript-eslint/no-unused-vars */
import { Engine, Scene } from "@babylonjs/core";
import { LevelOne } from "../subscene";

export const createScene = (engine: Engine): Scene => {
  const scene = new Scene(engine);

  // should be enabled when testing and debugging
  // createAxes(scene);

  /**
   * Levels have their specific setup
   * for instance, cameras, lights, scenarios, etc.
   * TODO: Later it is required to render level-scene according to the game-progress logic
   * This will provide flexibility for extending the game later
   */
  const level1 = new LevelOne(scene);
  level1.run();
  return scene;
};
