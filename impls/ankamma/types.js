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

class MalKeyWord {
  constructor(value) {
    this.value = value;
  }

  pr_str() {
    return this.value;
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
};
