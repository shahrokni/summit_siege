export const stateMachine = {
  exprs: {
    ETrue: {
      opr: "()",
      facts: ["true"],
    },
    EFalse: {
      opr: "()",
      facts: ["false"],
    },
    Expr1: {
      opr: "()",
      facts: ["target_path_found"],
    },
    Expr2: {
      opr: "!",
      facts: ["sniper_in_range"],
    },
    Expr3: {
      opr: "!",
      facts: ["is_aggressive"],
    },
    Expr4: {
      opr: "()",
      facts: ["sniper_in_range"],
    },
    Expr5: {
      opr: "&",
      facts: ["is_aggressive", "sniper_in_range"],
    },
    Expr6: {
      opr: "()",
      facts: ["is_target_reached"],
    },
    Expr7: {
      opr: "()",
      facts: ["is_cover_reached"],
    },
    Expr8: {
      opr: "&",
      facts: ["is_cover_reached", "sniper_in_range"],
    },
    Expr9: {
      opr: "()",
      facts: ["shot"],
    },
  },
  combs: {
    CAdvance: {
      exprs: ["Expr1", "EFalse"],
      oprs: ["|"],
    },
    CNotFire: {
      exprs: ["Expr2", "ETrue"],
      oprs: ["&"],
    },
    CFindCover: {
      exprs: ["Expr3", "Expr4"],
      oprs: ["&"],
    },
    CAggrFire: {
      exprs: ["Expr8", "EFalse"],
      oprs: ["|"],
    },
    CSurvive: {
      exprs: ["Expr6", "EFalse"],
      oprs: ["|"],
    },
    CCover: {
      exprs: ["Expr7", "EFalse"],
      oprs: ["|"],
    },
    CFire: {
      exprs: ["Expr4", "EFalse"],
      oprs: ["|"],
    },
    CShot: {
      exprs: ["Expr9", "EFalse"],
      oprs: ["|"],
    },
  },
  trans: {
    TAdvance: {
      comb: "CAdvance",
      next: "Advancing",
    },
    TNotFire: {
      comb: "CNotFire",
      next: "FindingTargetPath",
    },
    TAggrFire: {
      comb: "CAggrFire",
      next: "Firing",
    },
    TFindCover: {
      comb: "CFindCover",
      next: "FindingCoverPath",
    },
    TSurvive: {
      comb: "CSurvive",
      next: "Survived",
    },
    TCover: {
      comb: "CCover",
      next: "Covering",
    },
    TFire: {
      comb: "CFire",
      next: "FindingTargetPath",
    },
    TShot: {
      comb: "CShot",
      next: "Dead",
    },
  },
  initial_state: "Spawned",
  states: {
    FindingTargetPath: ["TAdvance", "TShot"],
    Advancing: ["TAggrFire", "TSurvive", "TFindCover", "TShot"],
    Firing: ["TNotFire", "TShot"],
    Spawned: ["TNotFire", "TAggrFire", "TFindCover", "TShot"],
    FindingCoverPath: ["TCover", "TShot"],
    Covering: ["TAggrFire", "TFire", "TShot"],
    Survived: [],
    Dead: [],
  },
};
