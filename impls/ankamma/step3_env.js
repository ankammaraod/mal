const readline = require("readline");
const { read_str } = require("./reader");
const { pr_str } = require("./printer.js");
const { MalSymbol, MalList, MalValue, MalVector } = require("./types");
const { Env } = require("./env.js");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const _env = {
  "+": (...args) => args.reduce((a, b) => a + b),
  "-": (...args) => args.reduce((a, b) => a - b),
  "*": (...args) => args.reduce((a, b) => a * b),
  "/": (...args) => args.reduce((a, b) => a / b),
};

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) {
    return env.get(ast);
  }

  if (ast instanceof MalList) {
    const newAst = ast.value.map((x) => EVAL(x, env));
    return new MalList(newAst);
  }

  if (ast instanceof MalVector) {
    const newAst = ast.value.map((x) => EVAL(x, env));
    return new MalVector(newAst);
  }

  return ast;
};

const READ = (str) => read_str(str);

const EVAL = (ast, env) => {
  if (!(ast instanceof MalList)) {
    return eval_ast(ast, env);
  }

  if (ast.isEmpty()) {
    return ast;
  }

  switch (ast.value[0].value) {
    case "def!":
      env.set(ast.value[1], EVAL(ast.value[2], env));
      return env.get(ast.value[1]);
  }

  const [fn, ...args] = eval_ast(ast, env).value;
  return fn.apply(null, args);
};

const PRINT = (malValue) => pr_str(malValue);

const env = new Env();
env.set(new MalSymbol("+"), (...args) => args.reduce((a, b) => a + b));
env.set(new MalSymbol("-"), (...args) => args.reduce((a, b) => a - b));
env.set(new MalSymbol("*"), (...args) => args.reduce((a, b) => a * b));
env.set(new MalSymbol("/"), (...args) => args.reduce((a, b) => a / b));

const rep = (str) => PRINT(EVAL(READ(str), env));

const repl = () =>
  rl.question("user> ", (line) => {
    try {
      console.log(rep(line));
    } catch (e) {
      console.log(e);
    }
    repl();
  });

repl();
