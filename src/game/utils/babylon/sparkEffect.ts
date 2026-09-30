import {
  Color4,
  DynamicTexture,
  ParticleSystem,
  Vector3,
  type Scene,
} from "@babylonjs/core";
import type { TPosition } from "../../scene";

export const renderSparkEffect = (scene: Scene, position: TPosition): void => {
  const texture = new DynamicTexture(
    "spark-particle",
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

  const particles = new ParticleSystem("spark", 100, scene);

  particles.particleTexture = texture;

  particles.emitter = new Vector3(position.x, position.y + 1, position.z);

  particles.color1 = new Color4(1, 0.95, 0.8, 1);
  particles.color2 = new Color4(1, 0.6, 0.15, 1);
  particles.colorDead = new Color4(0.2, 0.2, 0.2, 0);

  particles.minSize = 0.02;
  particles.maxSize = 0.07;

  particles.minLifeTime = 0.08;
  particles.maxLifeTime = 0.3;

  particles.direction1 = new Vector3(-1, 0.2, -1);
  particles.direction2 = new Vector3(1, 1.2, 1);

  particles.minEmitPower = 5;
  particles.maxEmitPower = 14;

  particles.gravity = new Vector3(0, -9.81, 0);

  particles.manualEmitCount = 15;

  particles.disposeOnStop = true;
  particles.targetStopDuration = 0.05;

  particles.start();
};
