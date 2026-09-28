import { Mesh, RecastJSPlugin } from "@babylonjs/core";
import Recast from "recast-detour";

type TOperation = "init";
const recast = await Recast();
const navigationPlugin: RecastJSPlugin = new RecastJSPlugin(recast);
let init: boolean = false;

onmessage = (e) => {
  const data = e.data as Array<string | Mesh>;
  if (!data.length) return;

  const operation = data[0] as TOperation;

  if (operation === "init" && !init) {
    init = true;
    const meshes = data.splice(1, e.data.length - 1) as Array<Mesh>;
    if (!meshes.length) return;

    navigationPlugin.createNavMesh(meshes, {
      cs: 0.2,
      ch: 0.2,
      walkableSlopeAngle: 35,
      walkableHeight: 1,
      walkableClimb: 1,
      walkableRadius: 1,
      maxEdgeLen: 12,
      maxSimplificationError: 1.3,
      minRegionArea: 8,
      mergeRegionArea: 20,
      maxVertsPerPoly: 6,
      detailSampleDist: 6,
      detailSampleMaxError: 1,
    });
  }
};
export {};
