import {
  LoadAssetContainerAsync,
  Mesh,
  StandardMaterial,
  Texture,
  type Scene,
} from "@babylonjs/core";
import type { TPosition, TRotation } from "../../scene";
import {
  EntityCollection,
  type IEntity,
  type IEntityCollection,
} from "../../scene/entity";
import { PlatformEntity } from "./platform";

export class PlatformEntityCollection
  extends EntityCollection<IEntity<Array<Mesh>>>
  implements IEntityCollection
{
  constructor(scene: Scene, groundLength: number) {
    super(scene);
    this.groundLength = groundLength;
  }

  private groundLength: number;

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
      "/models/platform1.obj",
      this.scene,
    );

    const gl = this.groundLength;
    const locations: Record<string, number[]> = {
      tl: [gl / 2, gl / -2, -2, 2, Math.PI / 2],
      tr: [gl / -2, gl / -2, 2, 2, Math.PI / 2],
      bl: [gl / 2, gl / 2, -2, -2, Math.PI / -2],
      br: [gl / -2, gl / 2, 2, -2, Math.PI / -2],
    };

    const material = new StandardMaterial("metalMaterial", this.scene);
    const texture = new Texture(
      "public/textures/metal053C_1K/Metal053C_1K-JPG_Color.jpg",
      this.scene,
    );
    material.diffuseTexture = texture;

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
          m.material = material;
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
}
