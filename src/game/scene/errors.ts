export const STD_ERR = Object.freeze({
  index_out_of_range: "Index our of range",
});

export const STD_WARNING = Object.freeze({
  not_found: "Not found",
  entity_limit_reached: "Entity limit reached",
});

export const printStdWarn = (
  path: string | string[],
  warn: keyof typeof STD_WARNING,
): void => {
  const _path = Array.isArray(path) ? path.join(">") : path;
  console.warn(`${_path}:${STD_WARNING[warn]}`);
};
