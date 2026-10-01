import {
  Color4,
  DynamicTexture,
  ParticleSystem,
  Scene,
  Vector3,
} from "@babylonjs/core";
import type { TPosition } from "../../scene";

export const renderDustEffect = (scene: Scene, position: TPosition): void => {
  const texture = new DynamicTexture(
    "dust-particle",
    { width: 64, height: 64 },
    scene,
    false,
  );

  texture.hasAlpha = true;

  const ctx = texture.getContext();
  ctx.clearRect(0, 0, 64, 64);

  const gradient = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  gradient.addColorStop(0, "rgba(255,255,255,0.8)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.5)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  texture.update();

  const particles = new ParticleSystem("dust", 100, scene);

  particles.particleTexture = texture;

  particles.emitter = new Vector3(position.x, position.y + 1, position.z);

  particles.color1 = new Color4(0.55, 0.48, 0.38, 0.5);
  particles.color2 = new Color4(0.35, 0.32, 0.28, 0.35);
  particles.colorDead = new Color4(0.25, 0.25, 0.25, 0);

  particles.minSize = 0.12;
  particles.maxSize = 0.35;

  particles.minLifeTime = 0.4;
  particles.maxLifeTime = 1.2;

  particles.direction1 = new Vector3(-0.7, 0.3, -0.7);
  particles.direction2 = new Vector3(0.7, 1.1, 0.7);

  particles.minEmitPower = 0.3;
  particles.maxEmitPower = 1.8;

  particles.gravity = new Vector3(0, -0.3, 0);
  particles.minAngularSpeed = -2;
  particles.maxAngularSpeed = 2;

  particles.manualEmitCount = 25;

  particles.disposeOnStop = true;
  particles.targetStopDuration = 0.05;

  particles.start();
};
