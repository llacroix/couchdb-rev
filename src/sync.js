var nano = require("nano")
    , colors = require("colors")
    , fs = require("fs")
    , npath = require("path")
    , Context = require("./context")
    , Design = require("./design")
    , Storage = require("./storage")

function sync(uri, database, revpath, tg_revision) {

    var db = nano(uri)
        , projects = db.use(database)

    
    if (!fs.existsSync(revpath)) {
        console.log("Revision directory doesn't exists".red)
        process.exit(1)
    }

    // TODO remove
    // console.log(tg_revision)

    projects.get("dbconfig", function (err, data) {
        // console.log(target_revision)
        //
        if (data == null) {
            data = {
                revision: undefined
            }
        }


        var revisions = fs.readdirSync(revpath).sort() 
            , target_revision = tg_revision || revisions.slice(-1)[0]
            , revision = data.revision
            , revision_index = revisions.indexOf(revision) 
            , target_revision_index = revisions.indexOf(target_revision)
            , storage = new Storage()
            , upgrades = undefined
            , downgrades = undefined

        if (revision == undefined || revision_index < 0) {
            revision_index = 0
            revision = revisions[revision_index]
        }

        // TODO remove
        // console.log("Current revision '" + revision + "'")
        // console.log("target_revision " + target_revision)
        // console.log("target_revision_index " + target_revision_index)
        // console.log(revisions)

        upgrades = revisions.map(function (path, index) {
            if (index <= target_revision_index) {
                var ctx = new Context(path)
                changeset = require(npath.resolve(revpath) + "/" + path)
                changeset(ctx)
                return ctx;
            } else {
                return undefined;
            }
        })
        .filter(function (k) { return k != undefined })

        downgrades = revisions.map(function (path, index) {
            if (index <= revision_index && index > target_revision_index && target_revision_index >= 0) {
                var ctx = new Context(path)
                changeset = require(npath.resolve(revpath) + "/" + path)
                changeset(ctx)
                return ctx;
            } else {
                return undefined;
            }
        })
        .filter(function (k) { return k != undefined })
        .reverse()

        // TODO remove
        //console.log(upgrades)
        //console.log(downgrades)

        // Do all upgrades first from version 0 to "n" or "current version"
        upgrades.forEach(function (ctx) {
            var message = "Processed upgrade to [" + ctx.name + "]"

            if (ctx.func_up)
                ctx.func_up(storage)
            
            console.log(message.green)
        })


        // Downgrade to version "x" if "current version" is higher than "x"
        // we can't simply go to the final revision as we have to track
        // which design could have to be deleted
        downgrades.forEach(function (ctx) {
            var message = "Processed downgrade to [" + ctx.name + "]"

            if (ctx.func_down)
                ctx.func_down(storage)

            console.log(message.green)
        })

        function insertDoc(doc) {
            /* Insert design documents into the database,
             * first if the documents already exists we have to update them with 
             * _rev.
             */
            projects.get(doc.getId(), function(err, docs, headers) {
                var obj = doc.toObject()

                if (docs) {
                    obj._rev = docs._rev;
                    projects.insert(obj, obj._id, function (err, body, head) {
                        var message = ""
                        if (!err) {
                            message = "Updated: " + obj._id
                            console.log(message.green)
                        } else {
                            message = "Could not update object with _id:" +
                            console.log(message.red)
                        }
                    })
                } else {
                    projects.insert(obj, obj._id, function (err, body, head) {
                        var message = ""

                        if (!err) {
                            message = "Inserted: " + obj._id
                            console.log(message.green)
                        } else {
                            message = "Could not insert object with _id: " + 
                                      obj._id
                            console.log(message.red)
                        }
                    })
                }
            })
        }

        // Insert all design one by one
        for (val in storage.designs) {
            var doc = storage.designs[val]
            insertDoc(doc)
        }

        // Delete all designs that should be deleted
        storage.deleted.forEach(function (val) {
            projects.get("_design/" + val, function (err, doc, head) {
                if (doc) {
                    var obj = {
                        _id: doc._id,
                        _rev: doc._rev,
                        _deleted: true
                    }

                    projects.insert(obj, doc._id, function (err, body, head) {
                        var message = "Deleted: " + doc._id
                        console.log(message.green)
                    })
                } else {
                    var message = "Could not delete document with _id: " + 
                                  "_design/" + val

                    console.log(message.red)
                }
            })
        })

        // Update the database with the latest revision
        projects.insert({
            _id: "dbconfig",
            _rev: data._rev,
            revision: target_revision
        }, "dbconfig")

        console.log("Database should be synced with your code... anytime".blue)

        //console.log(storage)
    })
}

module.exports = sync

//sync("http://localhost:5984/", "projects", "./revs/", "2014-07-23T14:06:46.816Z@Second.js")
