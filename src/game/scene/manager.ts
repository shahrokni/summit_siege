import { Engine, Scene } from "@babylonjs/core";
import { LevelOne } from "../subscene";
import { State, type IState } from "../state";
import type { ILevel } from "../subscene/level";
import type { ISubscriber } from "./observer";

export class Manager implements ISubscriber<IState> {
  constructor(engine: Engine) {
    this.id = "manager";
    this.scene = new Scene(engine);
    this.state = new State("easy");
    // should be enabled when testing and debugging
    // createAxes(scene);
  }

  /* private */
  private scene: Scene;
  private state: State;
  private levelInstance: ILevel | undefined;

  public notify(state: IState): void {
    switch (state.key) {
      case "level":
        this.run();
        break;
      default:
        break;
    }
  }

  /* public */
  public id: string;

  public run(): Scene {
    if (this.levelInstance) {
      this.levelInstance.dispose();
      this.levelInstance = undefined;
    }

    const level = this.state.getState().level || 1;
    switch (level) {
      case 1:
        this.levelInstance = new LevelOne(
          this.scene,
          this.state.incrementLevel,
        );
        break;
      default:
        this.levelInstance = new LevelOne(
          this.scene,
          this.state.incrementLevel,
        );
    }

    this.levelInstance.run();
    return this.scene;
  }
}
