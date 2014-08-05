/* Module Context
 *
 * This object is passed to the templates for revisions,
 * it defines a up and down function to 
 * upgrade / downgrade the designs.
 *
 * It is necessary to upgrade and downgrade each designs to properly track
 * changes in the designs.
 */

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
