const { pr_str } = require("./printer.js");

class MalValue {
  constructor(value) {
    this.value = value;
  }

  pr_str() {
    return this.value.toString();
  }
}

class MalSymbol extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalList extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return "(" + this.value.map((x) => pr_str(x)).join(" ") + ")";
  }

  isEmpty() {
    return this.value.length == 0;
  }
}

class MalVector extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return "[" + this.value.map((x) => pr_str(x)).join(" ") + "]";
  }
}

class MalNil extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return "nil";
  }
}

class MalBool extends MalValue {
  constructor(value) {
    super(value);
  }
  pr_str() {
    return this.value;
  }
}

class MalMap extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return (
      "{" +
      this.value
        .map((x, i) => {
          if (i % 2 != 0) return x + ",";
          return x.value;
        })
        .join(" ")
        .slice(0, -1) +
      "}"
    );
  }
}

class MalKeyWord extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return this.value;
  }
}

class MalString extends MalValue {
  constructor(value) {
    super(value);
  }
  pr_str() {
    return this.value;
  }
}

class MalFunction extends MalValue {
  constructor(fnbody, binds, env) {
    super(fnbody);
    this.binds = binds;
    this.oldEnv = env;
  }

  pr_str() {
    return "#<function>";
  }
}
module.exports = {
  MalSymbol,
  MalList,
  MalVector,
  MalNil,
  MalBool,
  MalMap,
  MalKeyWord,
  MalString,
  MalFunction,
};
