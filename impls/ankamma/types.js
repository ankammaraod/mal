const { pr_str } = require("./printer.js");

class MalSymbol {
  constructor(value) {
    this.value = value;
  }
}

class MalList {
  constructor(value) {
    this.value = value;
  }

  pr_str() {
    return "(" + this.value.map((x) => pr_str(x)).join(" ") + ")";
  }

  isEmpty() {
    return this.value.length == 0;
  }
}

class MalVector {
  constructor(value) {
    this.value = value;
  }

  pr_str() {
    return "[" + this.value.map((x) => pr_str(x)).join(" ") + "]";
  }
}

class MalNil {
  constructor(value) {
    this.value = null;
  }

  pr_str() {
    return "nil";
  }
}

class MalBool {
  constructor(value) {
    this.value = value;
  }
}

class MalMap {
  constructor(value) {
    this.value = value;
  }

  pr_str() {
    return "{" + this.value.map((x) => pr_str(x)).join(" ") + "}";
  }
}

module.exports = {
  MalSymbol,
  MalList,
  MalVector,
  MalNil,
  MalBool,
  MalMap,
};
