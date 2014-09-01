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
};

Design.prototype.getId = function () {
    /* Create an id like _id that will be used
     * later to save the design in the database or
     * to remove the design from the database.
     */
    return "_design/" + this.name;
};

Design.prototype.toObject = function () {
    /* Create an object that can be serialized and saved
     * to couchdb
     */
    var obj = {
        _id: this.getId(),
        language: "javascript",
        views: this.views
    };

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
    this.views[name] = {map: mapfunc.toString()};

    if (reducefunc) {
        this.views[name]["reduce"] = reducefunc.toString();
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

Design.prototype.removeValidateDocUpdate = function () {
    /* remove validate doc update function of the design
     */
    delete this.validate_doc_update

    return this
};

Design.prototype.setValidateDocUpdate = function (func) {
    /* set validate doc update function of the design
     */
    this.validate_doc_update = func.toString()

    return this
};

module.exports = Design;
