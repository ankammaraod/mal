const readline = require("readline");
const { read_str } = require("./reader");
const { pr_str } = require("./printer.js");
const {
  MalSymbol,
  MalList,
  MalValue,
  MalVector,
  MalNil,
  MalMap,
} = require("./types");
const { Env } = require("./env.js");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

  if (ast instanceof MalMap) {
    const newASt = ast.value.map((x) => EVAL(x, env));
    return new MalMap(newASt);
  }

  return ast;
};

const READ = (str) => read_str(str);

const let_env = (ast, outerEnv) => {
  const newEnv = new Env(outerEnv);
  bindings = ast.value[1].value;

  for (let i = 0; i < bindings.length; i += 2) {
    newEnv.set(bindings[i], EVAL(bindings[i + 1], newEnv));
  }
  return ast.value[2] ? EVAL(ast.value[2], newEnv) : new MalNil();
};

const if_fun = (ast, env) => {
  const if_result = EVAL(ast.value[1], env);
  if (if_result.value == "false" || if_result.value == "nil") {
    return ast.value[3] != "undefined" ? EVAL(ast.value[3], env) : null;
  }
  return ast.value[2] != "undefined" ? EVAL(ast.value[2], env) : null;
};

const do_fun = (ast, env) => {
  for (let i = 1; i < ast.value.length; i++) {
    result = EVAL(ast.value[i], env);
  }
  return result;
};

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
    case "let*":
      return let_env(ast, env);
    case "if":
      return if_fun(ast, env);
    case "do":
      return do_fun(ast, env);
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
env.set(new MalSymbol("print"), (arg) => {
  console.log(arg);
  return new MalNil();
});

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
