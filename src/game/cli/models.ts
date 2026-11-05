import type { Scene } from "@babylonjs/core";
import type { IEntity, IEntityCollection, TMesh } from "../scene";

export type TCLIEntityCollectionMethods =
  | "add"
  | "disposeById"
  | "getAll"
  | "getById";

export type TCLIEntityCollection = Partial<{
  [id: string]: Pick<
    IEntityCollection<IEntity<TMesh>>,
    TCLIEntityCollectionMethods
  >;
}>;

export interface ICLI {
  getAllCollections: () => TCLIEntityCollection;
  getScene: () => Scene;
}

export type IRecordResponse = Omit<IRecord, "type" | "status" | "index">;

export interface IRecord {
  index: number;
  status: "pending" | "executed" | "rejected";
  type: "request" | "info";
  text: string;
  at: number;
  response?: IRecordResponse;
}

export type THistory = IRecord[];

export type THelp = { desc: string; template: string };
