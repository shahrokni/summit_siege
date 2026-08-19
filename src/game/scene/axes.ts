import { TransformNode, Vector3, type Scene } from "@babylonjs/core";
import { AxesViewer } from "@babylonjs/core/Debug/axesViewer";

export const createAxes = (scene: Scene): void => {
  const axes = new AxesViewer(scene, 0.6);
  const root = new TransformNode("worldAxes", scene);

  axes.xAxis.parent = root;
  axes.yAxis.parent = root;
  axes.zAxis.parent = root;

  root.position = new Vector3(-4, 3, 0);
};
