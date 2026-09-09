import { type TFacts, FactDB } from "./factDB";
import { type TStates, StateMachine } from "./stateMachine";

export class Brain {
  constructor(fdb: FactDB, sm: StateMachine) {
    this.facts_db = fdb;
    this.state_machine = sm;
  }

  private facts_db;
  private state_machine;

  public getFact(fname: string) {
    return this.facts_db.getFact(fname);
  }

  public setFact(fname: string, val: number) {
    this.facts_db.setFact(fname, val);
  }

  public getFacts(): TFacts {
    return { ...this.facts_db.getFacts() };
  }

  public think(updater: (fdb: FactDB) => void): boolean {
    this.facts_db.update(updater);
    return this.updateStates();
  }

  public getCurState(): string {
    return this.state_machine.getCurState();
  }

  private updateStates(): boolean {
    const old_state: string = this.getCurState();
    if (this.state_machine.updateState(this.facts_db)) {
      const new_state: string = this.getCurState();
      if (old_state != new_state) return true;
    }
    return false;
  }
}

export function makeBrain(facts_db: TFacts, state_machine: TStates): Brain {
  const fdb = new FactDB(structuredClone(facts_db));
  const sm = new StateMachine(structuredClone(state_machine));
  const brain = new Brain(fdb, sm);
  return brain;
}
