var nano = require("nano")
    , db = nano("http://localhost:5984/")
    , fs = require("fs")
    , projects = db.use("projects");


function Context(name) {
    this.name = name;
};

Context.prototype.up = function (func) {
    this.func_up = func;
};

Context.prototype.down = function (func) {
    this.func_down = func;
};

function Design(name) {
    this.name = name;
    this.views = {}; 
};

Design.prototype.getId = function () {
    return "_design/" + this.name;
};

Design.prototype.toObject = function () {
    var obj = {
        _id: "_design/" + this.name,
        language: "javascript",
        views: this.views
    };

    return obj;
};


Design.prototype.toString = function () {
    return JSON.stringify(this.toObject());
};

Design.prototype.setView = function (name, mapfunc, reducefunc) {
    this.views[name] = {map: mapfunc.toString()};

    if (reducefunc) {
        this.views[name]["reduce"] = reducefunc.toString();
    }

    return this;
};

Design.prototype.removeView = function (name) {
    delete this.views[name]; 

    return this;
}

Design.prototype.removeValidateDocUpdate = function () {

    return this;
};

Design.prototype.setValidateDocUpdate = function (func) {

    return this;
};

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


projects.get("dbconfig", function (err, data) {
    var revision = data.revision || "init"
        , storage = new Storage()
        , contexts = [];


    console.log("Current revision '" + revision + "'"); 

    var revisions = fs.readdirSync("./revs").sort();

    revisions.forEach(function (path) {
        var ctx = new Context(path);
        changeset = require("./revs/" + path);

        changeset(ctx);

        contexts.push(ctx);

    });

    contexts.forEach(function (ctx) {
        if (ctx.func_up)
            ctx.func_up(storage);

        if (ctx.func_down)
            ctx.func_down(storage);
    });

    function insertDoc(doc) {
        projects.get(doc.getId(), function(err, docs, headers) {
            var obj = doc.toObject();

            if (docs) {
                obj._rev = docs._rev;
                projects.insert(obj, obj._id, function (err, body, head) {
                    console.log("ok updated: " + obj._id);
                });
            } else {
                projects.insert(obj, obj._id, function (err, body, head) {
                    console.log("ok inserted: " + obj._id);
                });
            }
        });

    };

    for (val in storage.designs) {
        var doc = storage.designs[val];
        insertDoc(doc); 
    }

    storage.deleted.forEach(function (val) {
        projects.get("_design/" + val, function (err, doc, head) {
            if (doc)
                projects.insert({_id: doc._id, _rev: doc._rev, _deleted: true}, "_design/" + val);
        });
    });

    console.log(storage);
});
