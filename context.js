function Context(name) {
    this.name = name;
};

Context.prototype.up = function (func) {
    this.func_up = func;
};

Context.prototype.down = function (func) {
    this.func_down = func;
};

module.exports = Context;
