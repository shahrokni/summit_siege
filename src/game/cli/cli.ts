import {
  ENTITY_COMMANDS_HELP,
  EntityCommandHandler,
} from "./entityCommandHandler";
import { CLI_ERRORS } from "./errors";
import type { ICLI, IRecord, THistory } from "./models";

export class GameCLI {
  constructor(cli: ICLI) {
    this.index = 0;
    this.history = [];
    this.locked = false;
    this.entityCommandHandler = new EntityCommandHandler(cli);
  }

  private entityCommandHandler: EntityCommandHandler;
  private history: THistory;
  private index: number;
  private locked: boolean;

  private getNextIndex(): number {
    return (this.index += 1);
  }

  private handleEntityExec(record: IRecord): void {
    this.entityCommandHandler.exec(record);
    return;
  }

  private buildHelp(): string {
    let help = "_____Entities_____\n";
    Object.entries(ENTITY_COMMANDS_HELP).forEach(([key, value]) => {
      help += ` ${key} command ${value.desc}\n`;
      help += ` ${value.template}\n`;
      help += "___________________\n";
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

    if (base === "entities") {
      this.handleEntityExec(record);
      return;
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
