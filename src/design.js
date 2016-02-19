/*
 * Design
 *
 * The design is a what would be located at _design/...
 *
 * Each design can contain multiple views and other functions
 *
 * We create the designs and we can add/delete views to the designs
 */

function Design(name) {
    // Some defaults
    this.name = name;
    this.views = {}; 
    this.shows = {};
    this.filters = {};
    this.updates = {};
    this.lists = {};
};

Design.prototype.getId = function () {
    /* Create an id like _id that will be used
     * later to save the design in the database or
     * to remove the design from the database.
     */
    return "_design/" + this.name;
};

function parseFunc(obj, attribute) {
  return  Object.keys(obj[attribute]).reduce(function (accum, val) {
    accum[val] = obj[attribute][val].toString();
    return accum;
  }, {})
}

Design.prototype.toObject = function () {
  /* Create an object that can be serialized and saved
   * to couchdb
   */
  var obj = {
    _id: this.getId(),
    language: "javascript"
  };

  var self = this;

  if (Object.keys(self.views).length > 0) {
    obj.views = Object.keys(self.views).reduce(function (accum, val) {

      accum[val] = {map: self.views[val].map.toString()};

      if (self.views[val].reduce) {
        accum[val].reduce = self.views[val].reduce.toString()
      }

      return accum;
    }, {})
  }

  if (Object.keys(self.shows).length > 0) {
    obj.shows = parseFunc(self, "shows");
  }

  if (Object.keys(self.filters).length > 0) {
    obj.filters = parseFunc(self, "filters");
  }

  if (Object.keys(self.updates).length > 0) {
    obj.updates = parseFunc(self, "updates");
  }

  if (Object.keys(self.lists).length > 0) {
    obj.lists = parseFunc(self, "lists");
  }

  if (this.validate_doc_update) {
    obj.validate_doc_update = this.validate_doc_update.toString()
  }

  return obj;
};


Design.prototype.toString = function () {
    /* Create a JSON string from the design. The string
     * could be used for debugging or saving to couchdb
     */
    return JSON.stringify(this.toObject());
};

Design.prototype.setView = function (name, mapfunc, reducefunc) {
    /* Set the view defined by name to the design. If a reduce function
     * is passed as parameter, it will also map the reduce function to the
     * design's view.
     *
     * Since we're passing functions, we have to call the toString function on
     * functions that we want to save. 
     */
    this.views[name] = {map: mapfunc};

    if (reducefunc) {
        this.views[name]["reduce"] = reducefunc;
    }

    return this;
};

Design.prototype.removeView = function (name) {
    /* Remove a view from the design. 
     * Return itself to allow chaining
     */
    delete this.views[name]; 

    return this;
}

Design.prototype.setFilter = function (name, func) {
  this.filters[name] = func;

  return this;
};

Design.prototype.removeFilter = function (name) {
  delete this.filters[name];

  return this;
}

Design.prototype.setUpdate = function (name, func) {
  this.updates[name] = func;

  return this;
};

Design.prototype.removeUpdate = function (name) {
  delete this.updates[name];

  return this;
}

Design.prototype.setList = function (name, func) {
  this.lists[name] = func;

  return this;
};

Design.prototype.removeList = function (name) {
  delete this.lists[name];

  return this;
}

Design.prototype.setShow = function (name, func) {
  this.shows[name] = func;

  return this;
};

Design.prototype.removeShow = function (name) {
  delete this.shows[name];

  return this;
}

Design.prototype.removeValidateDocUpdate = function () {
    /* remove validate doc update function of the design
     */
    delete this.validate_doc_update

    return this
};

Design.prototype.setValidateDocUpdate = function (func) {
    /* set validate doc update function of the design
     */
    this.validate_doc_update = func;

    return this
};

module.exports = Design;
