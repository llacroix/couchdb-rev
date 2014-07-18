function Design(name) {
    this.name = name;
    this.views = {}; 
};

Design.prototype.getId = function () {
    return "_design/" + this.name;
};

Design.prototype.toObject = function () {
    var obj = {
        _id: this.getId(),
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

module.exports = Design;
