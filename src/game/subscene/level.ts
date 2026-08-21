export interface ILevel {
  onFinish: () => void;
  run: () => void;
  dispose: () => void;
}
