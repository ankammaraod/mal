const pr_str = (value) => {
  if (typeof(value) !== "number") return value.pr_str();

  return value.toString();
};

module.exports = { pr_str };
