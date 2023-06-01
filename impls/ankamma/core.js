const { MalNil, MalList, MalBool, MalString } = require("./types");
const { pr_str } = require("./printer.js");
const { areEqual } = require("./utils.js");

core = {
  "+": (...args) => args.reduce((a, b) => a + b),

  "-": (...args) => {
    if (args.length == 1) return -args[0];
    return args.reduce((a, b) => a - b);
  },

  "*": (...args) => args.reduce((a, b) => a * b),

  "/": (a, b) => a / b,

  "list?": (arg) => new MalBool(arg instanceof MalList),

  "empty?": (arg) => new MalBool(arg.value.length == 0),

  ">": (...args) => {
    for (let i = 0; i < args.length - 1; i++) {
      if (args[i] <= args[i + 1]) {
        return new MalBool(false);
      }
    }
    return new MalBool(true);
  },

  "<": (...args) => {
    for (let i = 0; i < args.length - 1; i++) {
      if (args[i] >= args[i + 1]) {
        return new MalBool(false);
      }
    }
    return new MalBool(true);
  },

  ">=": (...args) => {
    for (let i = 0; i < args.length - 1; i++) {
      if (args[i] < args[i + 1]) {
        return new MalBool(false);
      }
    }
    return new MalBool(true);
  },

  "<=": (...args) => {
    for (let i = 0; i < args.length - 1; i++) {
      if (args[i] > args[i + 1]) {
        return new MalBool(false);
      }
    }
    return new MalBool(true);
  },

  "=": (arg1, arg2) => new MalBool(areEqual(arg1, arg2)),

  list: (...args) => new MalList(args),

  count: (arg) => {
    return arg.value ? arg.value.length : 0;
  },

  prn: (...args) => {
    const results = args.map((value) => pr_str(value));

    console.log(results.join(" "));
    return new MalNil();
  },

  "pr-str": (...args) => {
    const results = args.map((value) => pr_str(value));
    return new MalString(results.join(" "));
  },

  str: (...args) => {
    const results = args.map((value) => pr_str(value));
    return new MalString(results.join(""));
  },

  not: (arg) => {
    if (arg == 0) {
      return new MalBool(false);
    }
    return !arg.value || arg.value == "false"
      ? new MalBool("true")
      : new MalBool("false");
  },

  sumdown: (limit) => {
    let sum = 0;
    for (let i = 1; i <= limit; i++) {
      sum += i;
    }
    return sum;
  },
};

//str pr-str println prn  function params with &

module.exports = { core };
