import { Mesh } from "@babylonjs/core";
import type {
  IEntity,
  IAgent,
  TEntityCubeLength,
  TEntityId,
  TEntityPosition,
  TPosition,
} from "../../scene";
import { makeBrain, type Brain } from "../../brain";
import { facts } from "./state_machines/v1/facts";
import { stateMachine } from "./state_machines/v1/state_machine";
import { renderBloodEffect } from "../../utils/babylon/bloodEffect";
import type { FactDB } from "../../factDB";

export class DecoyEntity implements IEntity<Array<Mesh>>, IAgent {
  constructor(id: string, meshes: Array<Mesh>, position: TPosition) {
    this.body = meshes;

    this.rootId = id;
    this.position = position;
    this.brain = makeBrain(facts, stateMachine);
  }

  private body: Mesh[];
  private rootId: string;
  private position: TPosition;
  private brain: Brain;
  private isAggressive = Date.now() % 2 === 0;

  private states: Partial<Record<keyof typeof facts, boolean>> = {
    true: true,
    false: false,
    is_cover_reached: false,
    is_target_reached: false,
    shot: false,
    sniper_in_range: false,
    target_path_found: false,
  };

  private updateFactDb(fdb: FactDB): void {
    const factCheckers: Partial<Record<keyof typeof facts, boolean>> = {
      false: this.states.false,
      true: this.states.true,
      is_cover_reached: this.states.is_cover_reached,
      is_target_reached: this.states.is_target_reached,
      shot: this.states.shot,
      sniper_in_range: this.states.sniper_in_range,
      target_path_found: this.states.target_path_found,
    };

    fdb.setFact("is_aggressive", this.isAggressive ? 1 : 0);

    Object.entries(factCheckers).forEach((f) => {
      const [fact, state] = f;
      fdb.setFact(fact, state ? 1 : 0);
    });
  }

  private findTargetPath(): void {
    this.states = {
      ...this.states,
      is_target_reached: false,
      target_path_found: false,
      sniper_in_range: false,
    };

    /* show rotation animation */
    /* find path async */
    /* when found set the facts  */
    /* stop animation */
  }

  public getId(): TEntityId {
    return this.rootId;
  }

  public getPosition(): TEntityPosition {
    return this.position;
  }

  public getCubeLength(): TEntityCubeLength {
    throw new Error("TODO");
  }

  public isComplex(): boolean {
    return !!this.body.length;
  }

  public getMesh(): Mesh[] {
    return this.body;
  }

  public hit(): void {
    const scene = this.body[0]?.getScene();
    if (!scene) return;
    renderBloodEffect(scene, this.body[0].position);
  }

  public think(): void {
    if (!this.brain.think(this.updateFactDb.bind(this))) return;

    const currentState =
      this.brain.getCurState() as keyof typeof stateMachine.states;

    switch (currentState) {
      case "FindingTargetPath":
        this.findTargetPath();
        break;
      default:
        break;
    }
  }

  dispose(): void {
    this.body.forEach((m) => m.dispose());
  }
}
