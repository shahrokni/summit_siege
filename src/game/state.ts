export type TDifficulty = "easy" | "medium" | "hard";

export class State {
  constructor(difficulty: TDifficulty, gamer: string = "Player") {
    this.level = 1;
    this.difficulty = difficulty;
    this.gamer = gamer;
  }
  /* private */
  private level: number;
  private difficulty: TDifficulty;
  private gamer: string;

  getGamer(): string {
    return this.gamer;
  }

  getDifficulty() {
    return this.difficulty;
  }

  getLevel() {
    return this.level;
  }

  incrementLevel() {
    this.level += 1;
  }
}
