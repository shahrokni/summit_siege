import type { Camera } from '@babylonjs/core';
import type { IEntity, IEntityCollection, TMesh } from '../scene';

export type TCommandBranch = 'entity' | 'scene' | 'collection';

export const ALL_COMMAND_BRANCHES: TCommandBranch[] = ['entity', 'scene', 'collection'];

export type TSpecialCommands = 'help' | 'clear' | 'quit';

export type TCLIRootCommands = 'getAllCollections' | 'getAllCameras' | 'switchCamera';

export const ALL_ROOT_COMMANDS = ['getAllCollections', 'getAllCameras', 'switchCamera'];

export type TCLIEntityCollectionCommands = 'add' | 'disposeById' | 'getAll' | 'getById';

export const ALL_ENTITY_COLLECTION_COMMANDS: TCLIEntityCollectionCommands[] = [
  'add',
  'disposeById',
  'getAll',
  'getById',
];

export type TEntityCommand = 'attachCamera' | 'detachCamera';

export const ALL_ENTITY_COMMANDS: TEntityCommand[] = ['attachCamera', 'detachCamera'];

export type TCLIEntityCollection = Partial<{
  [id: string]: Pick<IEntityCollection<IEntity<TMesh>>, TCLIEntityCollectionCommands>;
}>;

export interface ICLI {
  getAllCollections: () => TCLIEntityCollection;
  getAllCameras: () => Camera[];
  switchCamera: (params: { id: string }) => void;
}

export type IRecordResponse = Omit<IRecord, 'type' | 'status' | 'index'>;

export interface IRecord {
  index: number;
  status: 'pending' | 'executed' | 'rejected';
  type: 'request' | 'info';
  text: string;
  at: number;
  response?: IRecordResponse;
}

export type THistory = IRecord[];

export type THelp = { desc: string; template: string; paramDesc?: string[] };

export type MethodParam = {
  name: string;
  leadingValuesCount: number;
  leadingValuesType: 'string' | 'number';
  leadingValuesObjectKeys: Array<string>;
  optional: boolean;
};

export type THelpObject<T extends string> = Record<T, THelp>;

export type TCommandDefinition<T extends string> = Record<T, MethodParam[]>;

export type TExecParam = Record<string, string | number | Record<string, string | number>>;
