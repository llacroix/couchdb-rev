/* Module Storage
 *
 * Store all designs and track deleted designs.
 *
 */
var Design = require("./design")

function Storage () {
    this.designs = {};
    // Deleted designs
    this.deleted = [];
};

Storage.prototype.get = function (name) {
    // get an existing design
    return this.designs[name];
};

Storage.prototype.create = function (name) {
    // Create a design and remove the design from the deleted
    // designs if it was present there
    if (this.deleted.indexOf(name) >= 0)
        this.deleted.splice(this.deleted.indexOf(name), 1);

    // Set the new design and return it
    this.designs[name] = new Design(name);
    return this.designs[name];
};

Storage.prototype.remove = function (name) {
    // Remove a design and add it to the list of deleted designs
    // It would be useful to use a Set instead of an array to store
    // deleted designs
    this.deleted.push(name);
    delete this.designs[name];
};

module.exports = Storage;
