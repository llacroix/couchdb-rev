#!/usr/bin/env node

var yargs = require('yargs')
    , argv = yargs
        .usage("Usage: $0")

        .default("dir", "./revs/")
        .describe("dir", "Directory where revision script are stored")

        .argv
    , list = require("./list")
    , create = require("./create")
    , sync = require("./sync")


if (argv.dir.slice(-1) != "/") {
    argv.dir += "/"

    console.log(argv.dir)
}


if (argv._[0] == "sync") {
    console.log("Syncing...")

    argv = yargs

         .default("uri", "http://localhost:5984/")
         .describe("uri", "URI to the couchdb server")

         .demand("db")
         .alias("db", "database")
         .describe("db", "Database to use")

         .describe("target", "target revision to use")

         .argv

    sync(argv.uri, argv.db, argv.dir, argv.target)
} else if (argv._[0] == "list") {
    list(argv.dir)
} else if (argv._[0] == "create") {
    create(argv.dir)
} else if (argv._[0] == "info"){
    console.log(process.cwd())
    console.log(argv)
    console.log(process)
}

