import { CLI_ERRORS } from "./errors";
import type { ICLI, IRecord, MethodParam, TExecParam } from "./models";

export interface ICommandHandler {
  exec: (record: IRecord) => void;
}

export class CommandHandler {
  constructor(cli: ICLI) {
    this.cli = cli;
  }

  protected cli: ICLI;

  protected buildExecParam(
    record: IRecord,
    paramDefinition: MethodParam[],
  ): TExecParam {
    const arr = record.text.split(" ");
    const execParam: TExecParam = {};

    for (const prm of paramDefinition) {
      const paramIdx = arr.findIndex((i) => i === `--${prm.name}`);
      if (!prm.optional && paramIdx === -1) {
        record.status = "rejected";
        record.response = {
          at: Date.now(),
          text: `--${prm.name} ${CLI_ERRORS.command_method_missing_param}`,
        };

        throw new Error(CLI_ERRORS.exec_param_not_built);
      }

      if (paramIdx >= 0) {
        if (prm.leadingValuesCount === 1) {
          execParam[prm.name] = "";
        } else {
          execParam[prm.name] = {};
        }

        let paramTypesError = "";
        for (let i = 1; i <= prm.leadingValuesCount; i += 1) {
          const paramValue =
            prm.leadingValuesType === "string"
              ? arr[paramIdx + i]
              : Number(arr[paramIdx + i]);

          if (
            (prm.leadingValuesType === "string" &&
              typeof paramValue !== "string") ||
            (prm.leadingValuesType === "number" && Number.isNaN(paramValue))
          ) {
            paramTypesError += ` ${paramValue} `;
          }

          if (prm.leadingValuesCount === 1) {
            execParam[prm.name] = paramValue;
          } else {
            const key = prm.leadingValuesObjectKeys[i - 1];
            (execParam[prm.name] as Record<string, string | number>)[key] =
              paramValue;
          }
        }

        if (paramTypesError) {
          record.status = "rejected";
          record.response = {
            at: Date.now(),
            text: `--${prm.name}${paramTypesError}${CLI_ERRORS.command_method_invalid_param_value}`,
          };
          throw new Error(CLI_ERRORS.exec_param_not_built);
        }
      }
    }

    return execParam;
  }
}
