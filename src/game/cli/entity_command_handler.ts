import type { TAttachCameraParam } from '../scene';
import { CommandHandler, type ICommandHandler } from './command_handler';
import { CLI_ERRORS } from './errors';
import {
  ALL_ENTITY_COMMANDS,
  type ICLI,
  type IRecord,
  type TCommandDefinition,
  type TEntityCommand,
  type TExecParam,
  type THelpObject,
} from './models';

/* TODO: add param description */
export const ENTITY_COMMANDS_HELP: THelpObject<TEntityCommand> = {
  attachCamera: {
    desc: 'attaches a camera to the entity.',
    template:
      'entity [collection_name] attachCamera --id [id] --index [index] --margin [x] [y] [z] --target [x] [y] [z]',
  },
  detachCamera: {
    desc: 'detaches the camera from the entity.',
    template: 'entity [collection_name] detachCamera --id [id]',
  },
};

const ENTITY_COMMANDS_DEFINITION: TCommandDefinition<TEntityCommand> = {
  attachCamera: [
    {
      name: 'id',
      optional: false,
      leadingValuesCount: 1,
      leadingValuesObjectKeys: ['id'],
      leadingValuesType: 'string',
    },
    {
      name: 'index',
      optional: false,
      leadingValuesCount: 1,
      leadingValuesObjectKeys: ['index'],
      leadingValuesType: 'number',
    },
    {
      name: 'margin',
      optional: false,
      leadingValuesCount: 3,
      leadingValuesObjectKeys: ['x', 'y', 'z'],
      leadingValuesType: 'number',
    },
    {
      name: 'target',
      optional: false,
      leadingValuesCount: 3,
      leadingValuesObjectKeys: ['x', 'y', 'z'],
      leadingValuesType: 'number',
    },
  ],
  detachCamera: [
    {
      name: 'id',
      optional: false,
      leadingValuesCount: 1,
      leadingValuesObjectKeys: ['id'],
      leadingValuesType: 'string',
    },
  ],
};

export class EntityCommandHandler extends CommandHandler implements ICommandHandler {
  constructor(cli: ICLI) {
    super(cli);
  }
  public exec(record: IRecord): void {
    const arr = record.text.split(' ');
    const collectionKey = arr[1].trim();
    const collection = this.cli.getAllCollections()[collectionKey];
    const method = arr[2].trim() as TEntityCommand;

    if (!collectionKey || !collection) {
      record.status = 'rejected';
      record.response = {
        text: `${collectionKey} ${CLI_ERRORS.collection_not_found}`,
        at: Date.now(),
      };
      return;
    }

    if (!ALL_ENTITY_COMMANDS.some((i) => i === method)) {
      record.status = 'rejected';
      record.response = {
        text: `${method} ${CLI_ERRORS.command_method_not_found}`,
        at: Date.now(),
      };
      return;
    }

    const paramsDef = ENTITY_COMMANDS_DEFINITION[method];
    let params: TExecParam;

    try {
      params = this.buildExecParam(record, paramsDef);
    } catch {
      return;
    }

    const entityId = params['id'] as string;
    const entityWrapper = collection.getById({ id: entityId });

    if (!entityWrapper) {
      record.status = 'rejected';
      record.response = {
        text: `${entityId} ${CLI_ERRORS.entity_not_found}`,
        at: Date.now(),
      };
      return;
    }

    /*at this point, there is no usage of this param*/
    delete params['id'];

    if (method === 'attachCamera') {
      console.log('params', params);
      entityWrapper.entity[method](params as unknown as TAttachCameraParam);
      record.status = 'executed';
    } else if (method === 'detachCamera') {
      entityWrapper.entity[method]();
    }
  }
}
