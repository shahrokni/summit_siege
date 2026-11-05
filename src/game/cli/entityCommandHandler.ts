import type { IAddParam } from "../scene";
import { CLI_ERRORS } from "./errors";
import type {
  ICLI,
  IRecord,
  TCLIEntityCollectionMethods,
  THelp,
} from "./models";

export type MethodParam = {
  name: string;
  leadingValuesCount: number;
  leadingValuesType: "string" | "number";
  leadingValuesObjectKeys: Array<string>;
  optional: boolean;
};

export const ENTITY_COMMANDS_HELP: Record<TCLIEntityCollectionMethods, THelp> =
  {
    add: {
      desc: "adds a new entity to the collection.",
      template:
        "entities [collection_name] add --position [x] [y] [z] --scale [scale]",
    },
    disposeById: {
      desc: "disposes an entity by its id.",
      template: "entities [collection_name] disposeById --id [id]",
    },
    getAll: {
      desc: "returns all collection entities.",
      template: "entities [collection_name] getAll",
    },
    getById: {
      desc: "returns an entity from the collection.",
      template: "entities [collection_name] getById --id [id]",
    },
  };

const Entity_COMMANDS_DEFINITION: Record<
  TCLIEntityCollectionMethods,
  MethodParam[]
> = {
  add: [
    {
      name: "position",
      leadingValuesCount: 3,
      leadingValuesType: "number",
      leadingValuesObjectKeys: ["x", "y", "z"],
      optional: false,
    },
    {
      name: "scale",
      leadingValuesCount: 1,
      leadingValuesType: "number",
      leadingValuesObjectKeys: ["scale"],
      optional: false,
    },
    {
      name: "rotation",
      leadingValuesCount: 3,
      leadingValuesType: "number",
      leadingValuesObjectKeys: ["x", "y", "z"],
      optional: true,
    },
  ],
  disposeById: [
    {
      name: "id",
      leadingValuesCount: 1,
      leadingValuesType: "string",
      leadingValuesObjectKeys: ["id"],
      optional: false,
    },
  ],
  getAll: [],
  getById: [
    {
      name: "id",
      leadingValuesCount: 1,
      leadingValuesType: "string",
      leadingValuesObjectKeys: ["id"],
      optional: false,
    },
  ],
};

export class EntityCommandHandler {
  constructor(cli: ICLI) {
    this.cli = cli;
  }

  private cli: ICLI;

  public exec(record: IRecord): void {
    const arr = record.text.split(" ");
    const entityKey = arr[1].trim();
    const entity = this.cli.getAllCollections()[entityKey];
    const method = arr[2].trim() as TCLIEntityCollectionMethods;

    if (!entityKey || !entity) {
      record.status = "rejected";
      record.response = {
        text: `${entityKey} ${CLI_ERRORS.collection_not_found}`,
        at: Date.now(),
      };
      return;
    }

    if (!method) {
      record.status = "rejected";
      record.response = {
        text: `${method} ${CLI_ERRORS.command_method_not_found}`,
        at: Date.now(),
      };
      return;
    }

    const paramsDef = Entity_COMMANDS_DEFINITION[method];
    const params: Record<
      string,
      string | number | Record<string, string | number>
    > = {};
    for (const prm of paramsDef) {
      const paramIdx = arr.findIndex((i) => i === `--${prm.name}`);
      if (!prm.optional && paramIdx === -1) {
        record.status = "rejected";
        record.response = {
          at: Date.now(),
          text: `--${prm.name} ${CLI_ERRORS.command_method_missing_param}`,
        };
        return;
      }

      if (paramIdx >= 0) {
        if (prm.leadingValuesCount === 1) {
          params[prm.name] = "";
        } else {
          params[prm.name] = {};
        }

        let paramTypesError = "";
        for (let i = 1; i <= prm.leadingValuesCount; i += 1) {
          const paramValue =
            prm.leadingValuesType === "string"
              ? arr[paramIdx + i]
              : Number(arr[paramIdx + i]);

          if (typeof paramValue !== prm.leadingValuesType) {
            paramTypesError += ` ${paramValue} `;
          }

          if (prm.leadingValuesCount === 1) {
            params[prm.name] = paramValue;
          } else {
            const key = prm.leadingValuesObjectKeys[i - 1];
            (params[prm.name] as Record<string, string | number>)[key] =
              paramValue;
          }
        }

        if (paramTypesError) {
          record.status = "rejected";
          record.response = {
            at: Date.now(),
            text: `--${prm.name}${paramTypesError}${CLI_ERRORS.command_method_invalid_param_value}`,
          };
          return;
        }
      }
    }

    if (method === "add") {
      entity[method](params as unknown as IAddParam);
      record.status = "executed";
      return;
    }

    if (method === "disposeById") {
      entity[method](params as unknown as { id: string });
      record.status = "executed";
      return;
    }

    if (method === "getAll") {
      const collection = entity[method]();
      record.status = "executed";
      record.response = {
        at: Date.now(),
        text: `${collection.map((i) => i.getId()).join("\n")}`,
      };
      return;
    }

    if (method === "getById") {
      const obj = entity[method](params as unknown as { id: string });
      record.status = "executed";
      record.response = {
        at: Date.now(),
        text: `${obj?.entity.getId()} ${JSON.stringify(obj?.entity.getPosition(0))}`,
      };
      return;
    }
  }
}
