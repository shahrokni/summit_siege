import type { FactDB } from "./factDB";

const EPSILON: number = 0.01;

export const OPERANDS = {
  NOT_ZERO: "()", // x != 0  ->  if (x)
  IS_ZERO: "!", // x == 0  ->  if (!x)
  AND: "&", // l && r
  OR: "|", // l || r
  EQ: "==", // l == r
  GT: ">", // l > r
  GEQ: ">=", // l >= r
  LT: "<", // l < r
  LEQ: "<=", // l <= r
  NEQ: "!=", // l != r
};

export interface TExprs {
  opr: string;
  facts: string[];
}

export interface TCombs {
  exprs: string[];
  oprs: string[];
}

interface TTrans {
  comb: string;
  next: string;
}

export interface TStates {
  exprs: Record<string, TExprs>;
  combs: Record<string, TCombs>;
  trans: Record<string, TTrans>;
  initial_state: string;
  states: Record<string, string[]>; // StateName, TransitionName[]
}

function doCombOpr(cl: boolean, opr: string, cr: boolean): boolean {
  if (opr == OPERANDS.AND) return cl && cr; // And combination left and right.
  if (opr == OPERANDS.OR) return cl || cr; // Or combination left and right.
  throw Error(`Known operator "${opr}"!`);
}

function isZero(f: number): boolean {
  return f == 0.0;
}

function isEqual(l: number, r: number): boolean {
  const diff: number = l - r;
  const abs_diff: number = Math.abs(diff);
  const eq: boolean = abs_diff <= EPSILON;
  return eq;
}

function isNotEq(l: number, r: number): boolean {
  const eq: boolean = isEqual(l, r);
  return !eq;
}

function isGreater(l: number, r: number): boolean {
  const diff: number = l - r;
  const gt: boolean = diff > EPSILON;
  return gt;
}

function isGreaterOrEq(l: number, r: number): boolean {
  const diff: number = l - r;
  const abs_diff: number = Math.abs(diff);
  const gt: boolean = diff > EPSILON;
  const eq: boolean = abs_diff <= EPSILON;
  const geq: boolean = gt || eq;
  return geq;
}

function isLesser(l: number, r: number): boolean {
  const rgt: boolean = isGreater(r, l); // Reverse greater
  return rgt;
}

function isLesserOrEq(l: number, r: number): boolean {
  const rgeq: boolean = isGreaterOrEq(r, l); // Reverse greater or equal
  return rgeq;
}

export class StateMachine {
  constructor(states: TStates) {
    this.cur_state = states.initial_state;
    this.states = states;
  }

  private cur_state: string;
  private states: TStates;

  public getCurState(): string {
    return this.cur_state;
  }

  public getStates(): TStates {
    return this.states;
  }

  public updateState(fdb: FactDB): boolean {
    const nxt = this.eval(fdb);
    if (nxt !== this.cur_state) {
      this.cur_state = nxt;
      return true;
    }
    return false;
  }

  /**
   * This function evaluates transitions and returns the name of the next
   * stat that in-going transition's condition is true. If all transitions
   * have been failed to evaluate then the current state name is returned.
   */
  private eval(fdb: FactDB): string {
    const trans = this.states.states[this.cur_state];
    for (const tn of trans) {
      const transitionRecord: TTrans = this.states.trans[tn];
      const combos: TCombs = this.states.combs[transitionRecord.comb];
      const res = this.evalComb(combos, fdb);
      if (res) return transitionRecord.next;
    }
    return this.cur_state;
  }

  private evalComb(combs: TCombs, fdb: FactDB): boolean {
    const c1: boolean = this.evalExpr(combs.exprs[0], fdb);
    const op: string = combs.oprs[0];
    const c2: boolean = this.evalExpr(combs.exprs[1], fdb);
    let result: boolean = doCombOpr(c1, op, c2);
    for (let i = 2; i < combs.exprs.length; ++i) {
      const cmb: boolean = this.evalExpr(combs.exprs[i], fdb);
      const opr: string = combs.oprs[i - 1];
      result = doCombOpr(result, opr, cmb);
    }
    return result;
  }

  private evalExpr(expr: string, fdb: FactDB): boolean {
    const opr = this.states.exprs[expr].opr;
    const facts = this.states.exprs[expr].facts;
    // Check facts size.
    switch (opr) {
      case OPERANDS.IS_ZERO:
      case OPERANDS.NOT_ZERO:
        if (facts.length != 1)
          throw Error(`Unary operator got ${facts.length} operands!`);
        break;
      case OPERANDS.AND:
      case OPERANDS.OR:
      case OPERANDS.EQ:
      case OPERANDS.GT:
      case OPERANDS.GEQ:
      case OPERANDS.LT:
      case OPERANDS.LEQ:
      case OPERANDS.NEQ:
        if (facts.length < 2)
          throw Error(`Binary operator got ${facts.length} operands!`);
        break;
      default:
        break; // Operators that do not need any operand size checking!
    }
    // Evaluate facts.
    switch (opr) {
      case OPERANDS.NOT_ZERO: {
        const fact = fdb.getFact(facts[0]);
        return !isZero(fact);
      }
      case OPERANDS.IS_ZERO: {
        const fact = fdb.getFact(facts[0]);
        return isZero(fact);
      }
      case OPERANDS.AND:
        for (let i = 0; i < facts.length; ++i) {
          const fact = fdb.getFact(facts[i]);
          if (isZero(fact)) return false;
        }
        return true;
      case OPERANDS.OR:
        for (let i = 0; i < facts.length; ++i) {
          const fact = fdb.getFact(facts[i]);
          if (!isZero(fact)) return true;
        }
        return false;
      case OPERANDS.EQ:
        for (let i = 0; i < facts.length - 1; ++i) {
          const f1 = fdb.getFact(facts[i]);
          const f2 = fdb.getFact(facts[i + 1]);
          if (!isEqual(f1, f2)) return false;
        }
        return true;
      case OPERANDS.GT:
        for (let i = 0; i < facts.length - 1; ++i) {
          const f1 = fdb.getFact(facts[i]);
          const f2 = fdb.getFact(facts[i + 1]);
          if (!isGreater(f1, f2)) return false;
        }
        return true;
      case OPERANDS.GEQ:
        for (let i = 0; i < facts.length - 1; ++i) {
          const f1 = fdb.getFact(facts[i]);
          const f2 = fdb.getFact(facts[i + 1]);
          if (!isGreaterOrEq(f1, f2)) return false;
        }
        return true;
      case OPERANDS.LT:
        for (let i = 0; i < facts.length - 1; ++i) {
          const f1 = fdb.getFact(facts[i]);
          const f2 = fdb.getFact(facts[i + 1]);
          if (!isLesser(f1, f2)) return false;
        }
        return true;
      case OPERANDS.LEQ:
        for (let i = 0; i < facts.length - 1; ++i) {
          const f1 = fdb.getFact(facts[i]);
          const f2 = fdb.getFact(facts[i + 1]);
          if (!isLesserOrEq(f1, f2)) return false;
        }
        return true;
      case OPERANDS.NEQ:
        for (let i = 0; i < facts.length - 1; ++i) {
          const f1 = fdb.getFact(facts[i]);
          const f2 = fdb.getFact(facts[i + 1]);
          if (!isNotEq(f1, f2)) return false;
        }
        return true;
      default:
        break; // Unknown operator!
    }
    throw Error(`Unknown operator "${opr}" in EvalExpr!`);
  }
}
