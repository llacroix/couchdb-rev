/*
 * Sub program that list all the existing revisions if any
 */

var fs = require("fs")

function logFirst(first, index) {
    console.log("[" + index + "] " + first)
}

function getTitle (name) {
    // slice 0, -3 to remove ".js"
    return name.split("@")[1].slice(0, -3)
}

module.exports = function (path) {
    // Read all files and sort them
    files = fs.readdirSync(path).sort()

    // Modify the names and 
    // print the revisions to output
    files.map(getTitle)
         .map(logFirst)
};
