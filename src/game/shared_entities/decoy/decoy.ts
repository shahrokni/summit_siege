import { Mesh, Scene, Vector3 } from "@babylonjs/core";
import type {
  IAgentEntity,
  TEntityCubeLength,
  TEntityId,
  TEntityPosition,
  TPosition,
  TThinkTool,
} from "../../scene";
import { makeBrain, type Brain } from "../../brain";
import { facts } from "./state_machines/v1/facts";
import { stateMachine } from "./state_machines/v1/state_machine";
import { renderBloodEffect } from "../../utils/babylon/bloodEffect";
import type { FactDB } from "../../factDB";
import { generatePathAnimation } from "../../utils/babylon/animationGenerator";

export class DecoyEntity implements IAgentEntity<Array<Mesh>> {
  constructor(id: string, meshes: Array<Mesh>, targetPosition: TPosition) {
    this.body = meshes;
    this.scene = meshes[0].getScene();
    this.targetPosition = targetPosition;
    this.rootId = id;
    this.brain = makeBrain(facts, stateMachine);
  }

  private scene: Scene;
  private body: Mesh[];
  private rootId: string;
  private brain: Brain;
  private targetPosition: TPosition;
  private isAggressive = Date.now() % 2 === 0;
  private computedTargetPath: Vector3[] | undefined;

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

  private findTargetPath(computePath: TThinkTool["computePath"]): void {
    const { x, y, z } = this.getPosition() as TPosition;
    const { x: tx, y: ty, z: tz } = this.targetPosition;
    const start = new Vector3(x, y, z);
    const end = new Vector3(tx, ty, tz);
    this.computedTargetPath = computePath(start, end);
    this.states.target_path_found = true;
  }

  private advance(): void {
    if (!this.computedTargetPath || this.computedTargetPath.length < 2) {
      return;
    }

    const [animationPosition, animationRotate] = generatePathAnimation(
      this.getId() as string,
      this.computedTargetPath,
      2,
      60,
    );
    for (const m of this.body) {
      m.animations.push(animationPosition);
      m.animations.push(animationRotate);
    }
    for (const m of this.body) {
      this.scene.beginAnimation(
        m,
        0,
        animationPosition.getHighestFrame(),
        false,
      );
    }
  }

  private cover(): void {}

  private findCoverPath(): void {}

  private fire(): void {}

  public getId(): TEntityId {
    return this.rootId;
  }

  public getPosition(): TEntityPosition {
    const m = this.body[0];
    if (!m) {
      throw new Error("Body mesh is undefined or null!");
    }
    return { x: m.position.x, y: m.position.y, z: m.position.z };
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
    renderBloodEffect(this.scene, this.body[0].position);
  }

  public think(tools: TThinkTool): void {
    if (!this.brain.think(this.updateFactDb.bind(this))) return;

    const currentState =
      this.brain.getCurState() as keyof typeof stateMachine.states;

    /* TODO:debug only */
    console.warn(`${this.getId()} state:`, currentState);

    switch (currentState) {
      case "FindingTargetPath":
        this.findTargetPath(tools.computePath);
        break;
      case "Advancing":
        this.advance();
        break;
      case "Covering":
        this.cover();
        break;
      case "FindingCoverPath":
        this.findCoverPath();
        break;
      case "Firing":
        this.fire();
        break;
      default:
        break;
    }
  }

  dispose(): void {
    this.body.forEach((m) => m.dispose());
  }
}
