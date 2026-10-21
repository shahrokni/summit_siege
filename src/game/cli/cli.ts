import type { Scene } from "@babylonjs/core";
import type { IEntity, IEntityCollection, TMesh } from "../scene";
import { CLI_ERRORS } from "./errors";

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

interface IRecord {
  index: number;
  status?: "pending" | "executed" | "rejected";
  type: "request" | "response";
  text: string;
  ts: number;
}

type THistory = IRecord[];

export class GameCLI {
  constructor(cli: ICLI) {
    this.cli = cli;
    this.history = [];
    this.index = 0;
    this.locked = false;
  }

  private cli: ICLI;
  private history: THistory;
  private index: number;
  private locked: boolean;

  private getNextIndex(): number {
    return (this.index += 1);
  }

  private handleEntityExec(record: IRecord): void {
    const arr = record.text.split(" ");
    const entityKey = arr[1];
    const entity = this.cli.getAllCollections()[entityKey];
    const method = arr[2] as TCLIEntityCollectionMethods;

    if (!method) {
      record.status = "rejected";
      this.history.push({
        index: this.getNextIndex(),
        text: `${method}-${CLI_ERRORS.command_method_not_found}`,
        ts: Date.now(),
        type: "response",
      });
      return;
    }

    if (!entity) {
      record.status = "rejected";
      this.history.push({
        index: this.getNextIndex(),
        text: `${entityKey}-${CLI_ERRORS.entity_not_found}`,
        ts: Date.now(),
        type: "response",
      });
      return;
    }
    console.log(entity);
  }

  private exec(): void {
    const record = this.history[this.history.length - 1];
    const arr = record.text.split(" ");
    const base = arr[0];
    if (!base) {
      record.status = "rejected";
      this.history.push({
        index: this.getNextIndex(),
        text: `${record.text}-${CLI_ERRORS.command_not_found}`,
        ts: Date.now(),
        type: "response",
      });
      return;
    }
    if (base === "entities") {
      this.handleEntityExec(record);
      return;
    }
  }

  public receiveCommand(cmd: string): THistory {
    if (this.locked) {
      throw new Error(CLI_ERRORS.cli_locked);
    }
    this.history.push({
      index: this.getNextIndex(),
      status: "pending",
      text: cmd,
      ts: Date.now(),
      type: "request",
    });
    this.locked = true;
    this.exec();
    this.locked = false;
    return [...this.history];
  }
}
