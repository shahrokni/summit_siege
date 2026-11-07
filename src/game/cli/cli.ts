import {
  COLLECTION_COMMANDS_HELP,
  EntityCollectionCommandHandler,
} from "./collection_command_handler";
import { EntityCommandHandler } from "./entity_command_handler";
import { CLI_ERRORS } from "./errors";
import {
  ALL_COMMAND_BRANCHES,
  type ICLI,
  type IRecord,
  type THelpObject,
  type THistory,
  type TSpecialCommands,
} from "./models";
import { ROOT_COMMANDS_HELP, RootCommandHandler } from "./root_command_handler";

const SPECIAL_COMMANDS_HELP: THelpObject<TSpecialCommands> = {
  help: {
    desc: "gives a set of instructions about the terminal.",
    template: "help",
  },
  clear: {
    desc: "clears the terminal. You can also use its synonym cls.",
    template: "clear",
  },
  quit: {
    desc: "closes the terminal. You can also use its synonym exit.",
    template: "quit",
  },
};

export class GameCLI {
  constructor(cli: ICLI) {
    this.index = 0;
    this.history = [];
    this.locked = false;
    this.entityCollectionCommandHandler = new EntityCollectionCommandHandler(
      cli,
    );
    this.rootCommandHandler = new RootCommandHandler(cli);
    this.entityCommandHandler = new EntityCommandHandler(cli);
  }

  private rootCommandHandler: RootCommandHandler;
  private entityCollectionCommandHandler: EntityCollectionCommandHandler;
  private entityCommandHandler: EntityCommandHandler;
  private history: THistory;
  private index: number;
  private locked: boolean;

  private getNextIndex(): number {
    return (this.index += 1);
  }

  private handleRootCommandExec(record: IRecord): void {
    this.rootCommandHandler.exec(record);
  }

  private handleEntityCollectionCommandExec(record: IRecord): void {
    this.entityCollectionCommandHandler.exec(record);
  }

  private handleEntityCommandExec(record: IRecord): void {
    this.entityCommandHandler.exec(record);
  }

  private buildHelp(): string {
    let help = "\n_Scene Commands_\n";
    Object.entries(ROOT_COMMANDS_HELP).forEach(([key, value]) => {
      help += ` ${key} command ${value.desc}\n`;
      help += ` ${value.template}\n`;
    });

    help = help.concat("\n_Collection Commands_\n");
    Object.entries(COLLECTION_COMMANDS_HELP).forEach(([key, value]) => {
      help += ` ${key} command ${value.desc}\n`;
      help += ` ${value.template}\n\n`;
    });

    help = help.concat("\n_Special Commands_\n");
    Object.entries(SPECIAL_COMMANDS_HELP).forEach(([key, value]) => {
      help += ` ${key} command ${value.desc}\n`;
      help += ` ${value.template}\n\n`;
    });
    return help;
  }

  private exec(): void {
    const record = this.history[this.history.length - 1];
    const cmd = record.text;

    if (cmd === "help") {
      record.status = "executed";
      const help = this.buildHelp();
      this.print(help);
      return;
    }

    const arr = cmd.split(" ");
    const base = arr[0];

    if (arr.length === 1 || !base) {
      record.status = "rejected";
      record.response = {
        text: `${record.text}-${CLI_ERRORS.command_not_found}`,
        at: Date.now(),
      };
      return;
    }

    if (!ALL_COMMAND_BRANCHES.some((b) => b !== base)) {
      record.status = "rejected";
      record.response = {
        text: `${record.text}-${CLI_ERRORS.command_branch_no_found}`,
        at: Date.now(),
      };
      return;
    }

    if (base === "scene") {
      this.handleRootCommandExec(record);
    } else if (base === "collection") {
      this.handleEntityCollectionCommandExec(record);
    } else if (base === "entity") {
      this.handleEntityCommandExec(record);
    }
  }

  public print(text: string): THistory {
    this.history.push({
      index: this.getNextIndex(),
      status: "executed",
      text,
      at: Date.now(),
      type: "info",
    });
    return this.history;
  }

  public execCommand(cmd: string): THistory {
    if (this.locked) {
      throw new Error(CLI_ERRORS.cli_locked);
    }
    this.history.push({
      index: this.getNextIndex(),
      status: "pending",
      text: cmd,
      at: Date.now(),
      type: "request",
    });
    this.locked = true;
    this.exec();
    this.locked = false;
    return [...this.history];
  }

  public clear(): void {
    this.history = [];
  }

  public getHistory(): THistory {
    return [...this.history];
  }
}
