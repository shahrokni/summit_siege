import {
  AssetContainer,
  LoadAssetContainerAsync,
  Mesh,
  Ray,
  type Scene,
  StandardMaterial,
  Texture,
  TransformNode,
  UniversalCamera,
  Vector3,
} from '@babylonjs/core';

import { generateGunRecoilAnimation } from '../../../utils/babylon/animation_generator';
import type { TPlayerView } from '../state';

const AMPLITUDE_MAP: Record<TPlayerView, number> = {
  normal: -0.2,
  scope1: -0.008,
  scope2: -0.005,
};

export class Camera {
  constructor(scene: Scene) {
    this.scene = scene;
    this.id = 'weapon';
  }

  private id: string;
  private normalFov: number | undefined;
  private camera: UniversalCamera | undefined;
  private fovMap: Record<TPlayerView, number> | undefined;
  private scene: Scene;
  private container: AssetContainer | undefined;
  private recoilPivot: TransformNode | undefined;

  public async init(): Promise<void> {
    if (this.container) return;

    const camera = new UniversalCamera('camera', new Vector3(0, 25, 65), this.scene);
    this.normalFov = camera.fov;
    this.fovMap = {
      normal: this.normalFov,
      scope1: 0.5,
      scope2: 0.2,
    };
    camera.setTarget(Vector3.Zero());
    camera.rotation.x = 0;
    camera.attachControl();
    this.camera = camera;

    this.container = await LoadAssetContainerAsync('/models/dragunov/dragunov.obj', this.scene);

    const instance = this.container?.instantiateModelsToScene();
    if (!instance) return;

    const material = new StandardMaterial('dragunov', this.scene);
    const texture = new Texture('/models/dragunov/dragunov.png', this.scene);
    material.diffuseTexture = texture;

    const recoilPivot = new TransformNode('recoilPivot', this.scene);
    recoilPivot.parent = camera;
    recoilPivot.position.set(-0.1, -0.5, 1.28);
    this.recoilPivot = recoilPivot;

    const weaponHolder = new TransformNode('weaponHolder', this.scene);
    weaponHolder.parent = recoilPivot;
    weaponHolder.rotation.y = Math.PI * 0.38;
    weaponHolder.position.set(-0.1, -0.5, 1.28);
    weaponHolder.scaling.setAll(0.29);

    camera.minZ = 0.2;

    for (const root of instance.rootNodes) {
      root.parent = weaponHolder;
      if (root instanceof Mesh) {
        root.material = material;
      }
    }
  }

  public changeFov(view: TPlayerView): void {
    if (!this.camera) return;

    const fov = this.fovMap?.[view];

    if (fov === undefined) return;
    this.camera.fov = fov;
  }

  public getForwardRay(length: number): Ray {
    if (!this.camera) {
      throw new Error('camera is undefined');
    }

    return this.camera.getForwardRay(length);
  }

  public dispose(): void {
    this.camera?.dispose();
  }

  public recoil(view: TPlayerView): void {
    const scoped = view !== 'normal';

    const target = scoped ? this.camera : this.recoilPivot;

    if (!target) return;

    const amplitude = AMPLITUDE_MAP[view];

    const rotation = generateGunRecoilAnimation(
      this.id,
      0.3,
      amplitude,
      'rotation.x',
      target.rotation.x,
      60,
      0.08,
    );

    const translation = generateGunRecoilAnimation(
      this.id,
      0.3,
      -0.2,
      'position.z',
      target.position.z,
      60,
      0.08,
    );

    this.scene.beginDirectAnimation(
      target,
      [rotation.animation, translation.animation],
      0,
      rotation.keyFrames[rotation.keyFrames.length - 1],
      false,
    );
  }
}
