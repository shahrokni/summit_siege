import {
  LoadAssetContainerAsync,
  Mesh,
  type AssetContainer,
  type Scene,
} from "@babylonjs/core";
import type { TPosition, TRotation } from "../../scene";
import type { IEntity, IEntityCollection } from "../../scene/entity";
import { PlatformEntity } from "./platform";

export class PlatformEntityCollection implements IEntityCollection {
  constructor(scene: Scene, groundLength: number) {
    this.scene = scene;
    this.groundLength = groundLength;
  }

  private scene: Scene;
  private collection: Array<IEntity<Array<Mesh>>> = [];
  private container: AssetContainer | undefined;
  private groundLength: number;

  private findBydId(
    entityId: string,
  ): { entity: IEntity<Array<Mesh>>; idx: number } | undefined {
    const entityIndex = this.collection.findIndex(
      (e) => e.getId() === entityId,
    );
    if (entityIndex == -1) return undefined;
    return { entity: this.collection[entityIndex], idx: entityIndex };
  }

  public add(param: {
    position: TPosition;
    scale: number;
    rotation?: TRotation;
  }): void {
    throw new Error(`Limited set of platforms! ${param}`);
  }

  public async init(): Promise<void> {
    if (this.container) return;
    this.container = await LoadAssetContainerAsync(
      "/models/platform.obj",
      this.scene,
    );

    const gl = this.groundLength;
    const locations: Record<string, number[]> = {
      tl: [gl / 2, gl / -2, -2, 2, Math.PI / 2],
      tr: [gl / -2, gl / -2, 2, 2, Math.PI / 2],
      bl: [gl / 2, gl / 2, -2, -2, Math.PI / -2],
      br: [gl / -2, gl / 2, 2, -2, Math.PI / -2],
    };

    Object.keys(locations).forEach((k) => {
      const [x, z, ax, az, rotationY] = locations[k];
      const instance = this.container?.instantiateModelsToScene();
      const meshes: Mesh[] = [];

      let _x: number = 0;
      let _y: number = 0;
      let _z: number = 0;

      for (const m of instance?.rootNodes || []) {
        if (m instanceof Mesh) {
          _x = x + ax;
          _z = z + az;
          _y = 0;
          m.position.set(_x, _y, _z);
          m.rotation.y = rotationY;
          m.scaling.setAll(0.6);
          meshes.push(m);
        }
      }

      const platform = new PlatformEntity(`platform-${k}`, meshes, {
        x: _x,
        y: _y,
        z: _z,
      });
      this.collection.push(platform);
    });
  }

  public dispose(): void {
    this.collection.forEach((e) => e.dispose());
    this.collection.splice(0, this.collection.length);
  }

  public disposeById(entityId: string): void {
    const response = this.findBydId(entityId);
    if (!response) {
      console.warn("No object found to dispose!");
      return;
    }
    const { entity, idx } = response;
    entity.dispose();
    this.collection.splice(idx, 1);
  }
}
