import type { IPublisher, ISubscriber } from "./scene/observer";

export type TDifficulty = "easy" | "medium" | "hard";

export interface IState {
  key: Omit<keyof IState, "key">;
  difficulty: TDifficulty;
  gamer: string;
  level: number;
}

export class State implements IPublisher<IState> {
  constructor(difficulty: TDifficulty, gamer: string = "Player") {
    this.level = 1;
    this.difficulty = difficulty;
    this.gamer = gamer;
    this.subscribers = [];
  }
  /* private */
  private level: number;
  private difficulty: TDifficulty;
  private gamer: string;
  private subscribers: ISubscriber<IState>[];

  public getState(): Partial<IState> {
    return {
      level: this.level,
      difficulty: this.difficulty,
      gamer: this.gamer,
    };
  }

  public subscribe(subscriber: ISubscriber<IState>): void {
    const idx = this.subscribers.findIndex((s) => s.id === subscriber.id);
    if (idx > 0) return;

    this.subscribers.push(subscriber);
  }

  public unsubscribe(id: string): void {
    const idx = this.subscribers.findIndex((s) => s.id === id);
    if (idx === -1) return;

    this.subscribers.splice(idx, 1);
  }

  public incrementLevel() {
    this.level += 1;
    const state = this.getState();
    state.key = "level";
    this.subscribers.forEach((s) => s.notify(state as IState));
  }
}
