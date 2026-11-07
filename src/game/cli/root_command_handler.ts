import { CommandHandler, type ICommandHandler } from "./command_handler";
import { CLI_ERRORS } from "./errors";
import {
  ALL_ROOT_COMMANDS,
  type ICLI,
  type IRecord,
  type TCLIRootCommands,
  type TCommandDefinition,
  type TExecParam,
  type THelpObject,
} from "./models";

export const ROOT_COMMANDS_HELP: THelpObject<TCLIRootCommands> = {
  getAllCollections: {
    desc: "returns all collections of the current scene.",
    template: "scene getAllCollections",
  },
  getAllCameras: {
    desc: "returns all cameras attached to the scene.",
    template: "scene getAllCameras",
  },
  switchCamera: {
    desc: "switches the active camera of the scene",
    template: "scene switchCamera --id [id]",
  },
};

export const ROOT_COMMANDS_DEFINITION: TCommandDefinition<TCLIRootCommands> = {
  getAllCameras: [],
  getAllCollections: [],
  switchCamera: [
    {
      name: "id",
      leadingValuesCount: 1,
      leadingValuesObjectKeys: ["id"],
      leadingValuesType: "string",
      optional: false,
    },
  ],
};

export class RootCommandHandler
  extends CommandHandler
  implements ICommandHandler
{
  constructor(cli: ICLI) {
    super(cli);
  }

  public exec(record: IRecord): void {
    const arr = record.text.split(" ");
    const method = arr[1].trim() as TCLIRootCommands;

    if (!ALL_ROOT_COMMANDS.some((i) => i === method)) {
      record.status = "rejected";
      record.response = {
        text: `${method} ${CLI_ERRORS.command_method_not_found}`,
        at: Date.now(),
      };
      return;
    }

    const paramsDef = ROOT_COMMANDS_DEFINITION[method];
    let params: TExecParam;

    try {
      params = this.buildExecParam(record, paramsDef);
    } catch {
      return;
    }

    if (method === "getAllCollections") {
      const collections = this.cli[method]();
      record.status = "executed";
      record.response = {
        at: Date.now(),
        text: `${Object.keys(collections).join("\n")}`,
      };
    } else if (method === "getAllCameras") {
      const cameras = this.cli[method]();
      record.status = "executed";
      record.response = {
        at: Date.now(),
        text: `${cameras.map((c) => c.name).join("\n")}`,
      };
    } else if (method === "switchCamera") {
      this.cli[method](params as unknown as { id: string });
      record.status = "executed";
    }
  }
}
