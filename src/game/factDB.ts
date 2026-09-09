export type TFacts = Record<string, number>;

export class FactDB {
  constructor(fdb: TFacts) {
    this.facts_db = fdb;
  }

  private facts_db: TFacts;

  public getFacts(): TFacts {
    return this.facts_db;
  }

  public getFact(name: string): number {
    if (!(name in this.facts_db)) throw Error(`Fact "${name}" does not exist!`);
    return this.facts_db[name];
  }

  public setFact(name: string, val: number): void {
    this.facts_db[name] = val;
  }

  public update(updater: (fdb: FactDB) => void): void {
    updater(this);
  }
}
