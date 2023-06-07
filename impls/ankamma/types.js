const pr_str = (val, print_readably = false) => {
  if (val instanceof MalValue) {
    return val.pr_str(print_readably);
  }

  if (val instanceof Function) {
    return "#<function>";
  }

  return val.toString();
};

const createMalString = (str) => {
  const string = str.replace(/\\(.)/g, (_, captured) =>
    captured === "n" ? "\n" : captured
  );

  return new MalString(string);
};

class MalValue {
  constructor(value) {
    this.value = value;
  }
  pr_str() {
    return this.value.toString();
  }

  isEqual(othervalue) {
    return othervalue instanceof MalValue && othervalue === this;
  }
}

class MalSymbol extends MalValue {
  constructor(value) {
    super(value);
  }

  isEqual(othervalue) {
    return othervalue instanceof MalSymbol && othervalue.value === this.value;
  }

  // pr_str(print_readably = false) {
  //   return this.value;
  // }
}

class MalSeq extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_seq(print_readably = false, brackets = ["(", ")"]) {
    const [opening, closing] = brackets;
    return (
      opening +
      this.value.map((x) => pr_str(x, print_readably)).join(" ") +
      closing
    );
  }

  isEmpty() {
    return this.value.length == 0;
  }

  count() {
    return this.value.length;
  }

  isEqual(other) {
    if (!(other instanceof MalSeq)) {
      return false;
    }

    if (this.count() !== other.count()) {
      return false;
    }

    for (let i = 0; i < this.count(); i++) {
      if (!isEqual(this.value[i], other.value[i])) {
        return false;
      }
    }

    return true;
  }

  beginsWith(symbol) {
    return this.value.length > 0 && this.value[0].value === symbol;
  }

  nth(n) {
    if (n >= this.value.length) {
      throw "index out of range";
    }
    return this.value[n];
  }

  first() {
    if (this.value.length <= 0) {
      return new MalNil();
    }
    return this.value[0];
  }

  rest() {
    return new MalList(this.value.slice(1));
  }
}

class MalList extends MalSeq {
  constructor(value) {
    super(value);
  }

  pr_str(print_readably = false) {
    return this.pr_seq(print_readably);
  }

  // beginsWith(symbol) {
  //   return this.value.length > 0 && this.value[0].value === symbol;
  // }
}

class MalVector extends MalSeq {
  constructor(value) {
    super(value);
  }

  pr_str(print_readably = false) {
    return this.pr_seq(print_readably, ["[", "]"]);
  }
}

class MalNil extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str(print_readably = false) {
    return "nil";
  }

  isEqual(othervalue) {
    return othervalue instanceof MalNil && othervalue.value === this.value;
  }

  first() {
    return this;
  }

  rest() {
    return new MalList([]);
  }
}

class MalBool extends MalValue {
  constructor(value) {
    super(value);
  }
  pr_str(print_readably = false) {
    return this.value;
  }

  isEqual(othervalue) {
    return othervalue instanceof MalBool && othervalue.value === this.value;
  }
}

class MalMap extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str(print_readably = false) {
    return (
      "{" +
      this.value
        .map((x) => {
          if (x instanceof MalValue) return x.pr_str(true);
          return x.toString();
        })
        .join(" ") +
      "}"
    );
  }
}

class MalKeyWord extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str(print_readably = false) {
    return this.value;
  }
  isEqual(othervalue) {
    return othervalue instanceof MalKeyWord && othervalue.value === this.value;
  }
}

class MalString extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str(print_readably = false) {
    if (print_readably) {
      return (
        '"' +
        this.value
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"')
          .replace(/\n/g, "\\n") +
        '"'
      );
    }

    return this.value;
  }

  isEqual(othervalue) {
    return othervalue instanceof MalString && othervalue.value === this.value;
  }
}

class MalFunction extends MalValue {
  constructor(fnbody, binds, env, fn, isMacro = false) {
    super(fnbody);
    this.binds = binds;
    this.oldEnv = env;
    this.fn = fn;
    this.isMacro = isMacro;
  }
  pr_str(print_readably = false) {
    return "#<function>";
  }

  apply(ctx, args) {
    return this.fn.apply(ctx, args);
  }
}

class MalAtom extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str(print_readably = false) {
    return `(atom ${pr_str(this.value, print_readably)})`;
  }

  deref() {
    return this.value;
  }

  reset(value) {
    this.value = value;
    return this.value;
  }
  swap(f, args) {
    this.value = f.apply(null, [this.value, ...args]);
    return this.value;
  }
}

const isEqual = (a, b) => {
  if (a instanceof MalValue && b instanceof MalValue) {
    return a.isEqual(b);
  }
  return a === b;
};

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
  pr_str,
  createMalString,
  MalAtom,
  isEqual,
  MalSeq,
};
