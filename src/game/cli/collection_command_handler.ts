import type { IAddParam } from "../scene";
import { CommandHandler, type ICommandHandler } from "./command_handler";
import { CLI_ERRORS } from "./errors";
import {
  ALL_ENTITY_COLLECTION_COMMANDS,
  type ICLI,
  type IRecord,
  type TCLIEntityCollectionCommands,
  type TCommandDefinition,
  type TExecParam,
  type THelpObject,
} from "./models";

export const COLLECTION_COMMANDS_HELP: THelpObject<TCLIEntityCollectionCommands> =
  {
    add: {
      desc: "adds a new entity to the collection.",
      template:
        "collection [collection_name] add --position [x] [y] [z] --scale [scale]",
    },
    disposeById: {
      desc: "disposes an entity by its id.",
      template: "collection [collection_name] disposeById --id [id]",
    },
    getAll: {
      desc: "returns all entities of the collections.",
      template: "collection [collection_name] getAll",
    },
    getById: {
      desc: "returns an entity from the collection.",
      template: "collection [collection_name] getById --id [id]",
    },
  };

const COLLECTION_COMMANDS_DEFINITION: TCommandDefinition<TCLIEntityCollectionCommands> =
  {
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

export class EntityCollectionCommandHandler
  extends CommandHandler
  implements ICommandHandler
{
  constructor(cli: ICLI) {
    super(cli);
  }

  public exec(record: IRecord): void {
    const arr = record.text.split(" ");
    const collectionKey = arr[1].trim();
    const collection = this.cli.getAllCollections()[collectionKey];
    const method = arr[2].trim() as TCLIEntityCollectionCommands;

    if (!collectionKey || !collection) {
      record.status = "rejected";
      record.response = {
        text: `${collectionKey} ${CLI_ERRORS.collection_not_found}`,
        at: Date.now(),
      };
      return;
    }

    if (!ALL_ENTITY_COLLECTION_COMMANDS.some((i) => i === method)) {
      record.status = "rejected";
      record.response = {
        text: `${method} ${CLI_ERRORS.command_method_not_found}`,
        at: Date.now(),
      };
      return;
    }

    const paramsDef = COLLECTION_COMMANDS_DEFINITION[method];
    let params: TExecParam;

    try {
      params = this.buildExecParam(record, paramsDef);
    } catch {
      return;
    }

    if (method === "add") {
      collection[method](params as unknown as IAddParam);
      record.status = "executed";
    } else if (method === "disposeById") {
      collection[method](params as unknown as { id: string });
      record.status = "executed";
    } else if (method === "getAll") {
      const allCollections = collection[method]();
      record.status = "executed";
      record.response = {
        at: Date.now(),
        text: `${allCollections.map((c) => c.getId()).join("\n")}`,
      };
    } else if (method === "getById") {
      const obj = collection[method](params as unknown as { id: string });
      record.status = "executed";
      record.response = {
        at: Date.now(),
        text: `${obj?.entity.getId()} ${JSON.stringify(obj?.entity.getPosition(0))}`,
      };
    }
  }
}
