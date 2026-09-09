export const stateMachine = {
  states: {
    Idle: ["TGoLeft", "TGoRight"],
    GoRight: ["TGoLeft", "TGoIdle"],
    GoLeft: ["TGoRight", "TGoIdle"],
  },
  exprs: {
    Expr2: {
      facts: ["is_right_pressed"],
      opr: "()",
    },
    Expr3: {
      facts: ["is_left_pressed"],
      opr: "!",
    },
    Expr1: {
      facts: ["is_left_pressed"],
      opr: "()",
    },
    EFalse: {
      facts: ["false"],
      opr: "()",
    },
    Expr4: {
      facts: ["is_right_pressed"],
      opr: "!",
    },
  },
  trans: {
    TGoRight: {
      comb: "CGoRight",
      next: "GoRight",
    },
    TGoLeft: {
      comb: "CGoLeft",
      next: "GoLeft",
    },
    TGoIdle: {
      comb: "CGoIdle",
      next: "Idle",
    },
  },
  combs: {
    CGoIdle: {
      oprs: ["&"],
      exprs: ["Expr3", "Expr4"],
    },
    CGoRight: {
      oprs: ["|"],
      exprs: ["Expr2", "EFalse"],
    },
    CGoLeft: {
      oprs: ["|"],
      exprs: ["Expr1", "EFalse"],
    },
  },
  initial_state: "Idle",
};
