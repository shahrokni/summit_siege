import {
  GroundMesh,
  MeshBuilder,
  StandardMaterial,
  Texture,
  type Scene,
} from "@babylonjs/core";

import type { IEntity, TPosition } from "../../../scene";

export class GroundEntity implements IEntity<GroundMesh> {
  constructor(scene: Scene, id: string) {
    this.id = id;
    this.length = 40;
    this.position = { x: 0, y: 0, z: 0 };
    const ground = MeshBuilder.CreateGround(
      id,
      { width: this.length, height: this.length },
      scene,
    );

    const material = new StandardMaterial("groundMaterial", scene);
    const texture = new Texture(
      "public/textures/ground062S_1K/Ground062S_1K-JPG_Color.jpg",
      scene,
    );

    texture.uScale = 6;
    texture.vScale = 6;
    material.diffuseTexture = texture;
    ground.material = material;

    this.mesh = ground;
  }

  isComplex(): boolean {
    return Array.isArray(this.mesh);
  }

  private id: string;
  private length: number;
  private mesh: GroundMesh;
  private position: TPosition;

  getPosition(): TPosition {
    return this.position;
  }

  public getMesh(): GroundMesh {
    return this.mesh;
  }

  public getId(): string {
    return this.id;
  }

  public getCubeLength(): number {
    return this.length;
  }

  public dispose(): void {
    this.mesh.dispose();
  }
}
