const { MalList } = require("./types.js");

class Env {

  constructor(outer, binds, expr) {
    this.outer = outer;
    this.data = {};
    this.#setBinds(binds, expr);
  }

  #setBinds(binds, exprs) {
    if (!binds) {
      return;
    }
    const vars = binds.value;

    let i = 0;
    while (i < vars.length && vars[i].value != "&") {
      this.set(vars[i], exprs[i]);
      i++;
    }

    if (i >= vars.length) {
      return;
    }
    i++;
    this.set(vars[i], new MalList(exprs.slice(i - 1)));
  }

  set(symbol, malValue) {
    this.data[symbol.value] = malValue;
  }

  find(symbol) {
    if (this.data[symbol.value] != undefined) {
      return this;
    }

    if (this.outer != undefined) {
      return this.outer.find(symbol);
    }
  }

  get(symbol) {
    const env = this.find(symbol);
    if (!env) throw `${symbol.value} not found`;

    return env.data[symbol.value];
  }
}

module.exports = { Env };
