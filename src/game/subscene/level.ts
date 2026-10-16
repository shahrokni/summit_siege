import type { IDisposable } from "../scene";

export interface ILevel extends IDisposable {
  onFinish: () => void;
  run: () => Promise<void>;
}
