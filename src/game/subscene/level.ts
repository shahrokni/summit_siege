export interface ILevel {
  onFinish: () => void;
  run: () => Promise<void>;
  dispose: () => void;
}
