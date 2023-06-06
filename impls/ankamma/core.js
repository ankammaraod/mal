const {
  MalNil,
  MalList,
  MalBool,
  MalString,
  MalAtom,
  MalVector,
  MalValue,
  isEqual,
} = require("./types");
const { pr_str } = require("./printer.js");
const { areEqual } = require("./utils.js");
const { read_str } = require("./reader.js");
const fs = require("fs");

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

  "=": (arg1, arg2) => new MalBool(isEqual(arg1, arg2)),

  list: (...args) => new MalList(args),

  count: (arg) => {
    return arg instanceof MalNil ? 0 : arg.value.length;
  },

  prn: (...args) => {
    const results = args.map((value) => pr_str(value));

    console.log(results.join(" "));
    return new MalNil();
  },

  "pr-str": (...args) => {
    return pr_str(
      new MalString(args.map((x) => pr_str(x, true)).join(" ")),
      true
    );
  },

  str: (...args) => {
    return new MalString(args.map((x) => pr_str(x, false)).join(""));
  },

  println: (...args) => {
    const result = args.map((x) => pr_str(x, false)).join(" ");
    console.log(result);
    return Nil;
  },

  "read-string": (string) => read_str(string.value),
  atom: (value) => new MalAtom(value),
  "atom?": (value) => value instanceof MalAtom,
  deref: (value) => value.deref(),
  "swap!": (atom, f, ...args) => {
    return atom.swap(f, args);
  },
  "reset!": (atom, value) => atom.reset(value),
  slurp: (filename) => new MalString(fs.readFileSync(filename.value, "utf-8")),
  cons: (value, list) => new MalList([value, ...list.value]),
  concat: (...lists) => new MalList(lists.flatMap((x) => x.value)),
  vec: (list) => new MalVector(list.value),
};

module.exports = { core };
