var fs = require("fs")

module.exports = function (path) {
    files = fs.readdirSync(path).sort()

    function getTitle (name) {
        // slice 0, -3 to remove ".js"
        return name.split("@")[1].slice(0, -3)
    }

    function logFirst(first, index) {
        console.log("[" + index + "] " + first)
    }

    files.map(getTitle)
         .map(logFirst)
};
