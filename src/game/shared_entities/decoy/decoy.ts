import {
  Color4,
  DynamicTexture,
  Mesh,
  ParticleSystem,
  Vector3,
} from "@babylonjs/core";
import type {
  IEntity,
  IIntelligent,
  TEntityCubeLength,
  TEntityId,
  TEntityPosition,
  TPosition,
} from "../../scene";
import { makeBrain, type Brain } from "../../brain";
import { facts } from "./facts";
import { stateMachine } from "./state_machine";
import type { FactDB } from "../../factDB";

export class DecoyEntity implements IEntity<Array<Mesh>>, IIntelligent {
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

    const texture = new DynamicTexture(
      "blood-particle",
      { width: 64, height: 64 },
      scene,
      false,
    );

    texture.hasAlpha = true;

    const ctx = texture.getContext();

    ctx.clearRect(0, 0, 64, 64);
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.fill();

    texture.update();

    const particles = new ParticleSystem("blood", 100, scene);

    particles.particleTexture = texture;

    const b = this.body[0];
    particles.emitter = new Vector3(
      b.position.x,
      b.position.y + 1,
      b.position.z,
    );

    particles.color1 = new Color4(0.7, 0, 0, 1);
    particles.color2 = new Color4(0.35, 0, 0, 1);

    particles.minSize = 0.05;
    particles.maxSize = 0.18;

    particles.minLifeTime = 0.4;
    particles.maxLifeTime = 1.2;

    particles.direction1 = new Vector3(-2, 1, -2);
    particles.direction2 = new Vector3(2, 4, 2);

    particles.minEmitPower = 2;
    particles.maxEmitPower = 6;

    particles.gravity = new Vector3(0, -9.81, 0);

    particles.manualEmitCount = 50;

    particles.disposeOnStop = true;
    particles.targetStopDuration = 0.1;

    particles.start();
  }

  public think(): void {
    const rnd = Math.floor(Math.random() * 3);
    let fn: ((fdb: FactDB) => void) | undefined;

    if (rnd === 0) {
      fn = (fdb: FactDB) => {
        fdb.setFact("is_left_pressed", 1);
        fdb.setFact("is_right_pressed", 0);
      };
    } else if (rnd === 1) {
      fn = (fdb: FactDB) => {
        fdb.setFact("is_left_pressed", 0);
        fdb.setFact("is_right_pressed", 1);
      };
    } else {
      fn = (fdb: FactDB) => {
        fdb.setFact("is_left_pressed", 0);
        fdb.setFact("is_right_pressed", 0);
      };
    }
    this.brain.think(fn!);
    const state = this.brain.getCurState();

    if (state === "GoRight") {
      this.body.forEach((b) => {
        b.position.x += 3;
      });
    } else if (state === "GoLeft") {
      this.body.forEach((b) => {
        b.position.x -= 3;
      });
    }
  }

  dispose(): void {
    this.body.forEach((m) => m.dispose());
  }
}
