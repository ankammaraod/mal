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
  MalBool,
  MalFunction,
  MalSeq,
} = require("./types");
const { Env } = require("./env.js");
const { core } = require("./core.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) return env.get(ast);

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

const handle_let = (ast, outerEnv) => {
  const newEnv = new Env(outerEnv);
  bindings = ast.value[1].value;

  for (let i = 0; i < bindings.length; i += 2) {
    newEnv.set(bindings[i], EVAL(bindings[i + 1], newEnv));
  }

  return [ast.value[2], newEnv];
};

const isFalse = (if_result) => {
  if (if_result instanceof MalList || if_result instanceof MalVector)
    return false;

  return if_result.value == false ||
    if_result.value == "false" ||
    if_result instanceof MalNil ||
    if_result.value == "undefined"
    ? true
    : false;
};

const handle_if = (ast, env) => {
  const [_, cond, true_exp, false_exp] = ast.value;
  const if_result = EVAL(cond, env);

  if (isFalse(if_result)) {
    return false_exp != undefined ? false_exp : new MalNil();
  }
  return true_exp != undefined ? true_exp : new MalNil();
};

const handle_do = (ast, env) => {
  const [, ...doforms] = ast.value;
  doforms.slice(0, -1).forEach((x) => EVAL(x, env));

  return doforms[doforms.length - 1];
};

const handle_function = (ast, env) => {
  [_, binds, ...fnbody] = ast.value;

  doforms = new MalList([new MalSymbol("do"), ...fnbody]);

  const fn = (...args) => {
    const newEnv = new Env(env, binds, args);
    return EVAL(ast.value[2], newEnv);
  };

  return new MalFunction(doforms, binds, env, fn);
};

const quasiqoute = (ast) => {
  if (ast instanceof MalList && ast.beginsWith("unquote")) {
    return ast.value[1];
  }
  if (ast instanceof MalSymbol || ast instanceof MalMap) {
    return new MalList([new MalSymbol("quote"), ast]);
  }

  if (ast instanceof MalSeq) {
    let result = new MalList([]);

    for (let i = ast.value.length - 1; i >= 0; i--) {
      const element = ast.value[i];

      if (element instanceof MalSeq && element.beginsWith("splice-unquote")) {
        result = new MalList([
          new MalSymbol("concat"),
          element.value[1],
          result,
        ]);
      } else {
        result = new MalList([
          new MalSymbol("cons"),
          quasiqoute(element),
          result,
        ]);
      }
    }
    if (ast instanceof MalVector) {
      return new MalList([new MalSymbol("vec"), result]);
    }
    return result;
  }
  return ast;
};

const EVAL = (ast, env) => {
  while (true) {
    if (!(ast instanceof MalList)) return eval_ast(ast, env);

    if (ast.isEmpty()) return ast;

    switch (ast.value[0].value) {
      case "def!":
        env.set(ast.value[1], EVAL(ast.value[2], env));
        return env.get(ast.value[1]);
      case "let*":
        [ast, env] = handle_let(ast, env);
        break;
      case "if":
        ast = handle_if(ast, env);
        break;
      case "do":
        ast = handle_do(ast, env);
        break;
      case "fn*":
        ast = handle_function(ast, env);
        break;
      case "quote":
        return ast.value[1];

      case "quasiquoteexpand":
        return quasiqoute(ast.value[1]);

      case "quasiquote":
        ast = quasiqoute(ast.value[1]);
        break;
      default:
        const [fn, ...exprs] = eval_ast(ast, env).value;
        if (fn instanceof MalFunction) {
          const newEnv = new Env(fn.oldEnv, fn.binds, exprs);
          ast = fn.value;
          env = newEnv;
        } else {
          return fn.apply(null, exprs);
        }
    }
  }
};

const PRINT = (malValue) => pr_str(malValue, true);

const env = new Env();

const createReplEnv = (env, rep) => {
  Object.keys(core).forEach((key) => {
    env.set(new MalSymbol(key), core[key]);
  });

  env.set(new MalSymbol("eval"), (ast) => EVAL(ast, env));
  env.set(new MalSymbol("*ARGV*"), new MalList(process.argv.slice(2)));
  rep(
    '(def! load-file (fn* (f) (eval (read-string (str "(do " (slurp f) "\nnil)")))))'
  );

  rep("(def! not (fn* (a) (if a false true)))");
};

const rep = (str) => PRINT(EVAL(READ(str), env));

createReplEnv(env, rep);

const repl = () =>
  rl.question("user> ", (line) => {
    try {
      console.log(rep(line));
    } catch (e) {
      console.log(e);
    }
    repl();
  });

if (process.argv.length >= 3) {
  rep(`(load-file "${process.argv[2]}")`);
  rl.close();
} else {
  repl();
}
