import {
  Color4,
  DynamicTexture,
  Mesh,
  ParticleSystem,
  Vector3,
} from "@babylonjs/core";
import type {
  IEntity,
  TEntityCubeLength,
  TEntityId,
  TEntityPosition,
  TPosition,
} from "../../scene";

export class DecoyEntity implements IEntity<Array<Mesh>> {
  constructor(id: string, meshes: Array<Mesh>, position: TPosition) {
    this.body = meshes;
    this.rootId = id;
    this.position = position;
  }
  private body: Mesh[];
  private rootId: string;
  private position: TPosition;

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

    particles.emitter = new Vector3(
      this.position.x,
      this.position.y + 1,
      this.position.z,
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

  dispose(): void {
    this.body.forEach((m) => m.dispose());
  }
}
