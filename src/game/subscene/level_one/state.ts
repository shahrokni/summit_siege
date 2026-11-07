export type TPlayerView = 'normal' | 'scope1' | 'scope2';

export interface IState {
  view: TPlayerView;
  health: number;
}

export class StateManager {
  constructor() {
    this.state = {
      view: 'normal',
      health: 5,
    };
  }

  private state: IState;

  public setHealth(health: number): void {
    if (health > 5 || health < 0) return;
    this.state.health = health;
  }

  public setView(view: TPlayerView): void {
    this.state.view = view;
  }

  public get<K extends keyof IState>(key: K): IState[K] {
    return this.state[key];
  }

  public getState(): IState {
    return { ...this.state };
  }
}
