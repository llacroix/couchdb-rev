function Storage () {
    this.designs = {};
    this.deleted = [];
};

Storage.prototype.get = function (name) {
    return this.designs[name];
};

Storage.prototype.create = function (name) {
    if (this.deleted.indexOf(name) >= 0)
        this.deleted.splice(this.deleted.indexOf(name), 1);

    this.designs[name] = new Design(name);
    return this.designs[name];
};

Storage.prototype.remove = function (name) {
    this.deleted.push(name);
    delete this.designs[name];
};

module.exports = Storage;
