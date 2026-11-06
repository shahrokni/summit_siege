import { CommandHandler, type ICommandHandler } from "./command_handler";
import { CLI_ERRORS } from "./errors";
import {
  ALL_ROOT_COMMANDS,
  type ICLI,
  type IRecord,
  type TCLIRootCommands,
  type THelpObject,
} from "./models";

export const ROOT_COMMANDS_HELP: THelpObject<TCLIRootCommands> = {
  getAllCollections: {
    desc: "returns all collections of the current scene.",
    template: "root getAllCollections",
  },
};

// const ROOT_COMMANDS_DEFINITION: TCommandDefinition<TCLIRootCommands> = {
//   getAllCollections: [],
// };

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

    /* no usage at the moment */
    // const paramsDef = ROOT_COMMANDS_DEFINITION[method];
    // let params: TExecParam;

    // try {
    //   params = this.buildExecParam(record, paramsDef);
    // } catch {
    //   return;
    // }

    if (method === "getAllCollections") {
      const collections = this.cli[method]();
      record.status = "executed";
      record.response = {
        at: Date.now(),
        text: `${Object.keys(collections).join("\n")}`,
      };
    }
  }
}
