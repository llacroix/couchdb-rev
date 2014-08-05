var script = require("../template/revision")
    , script_t = script.toString()
    , fs = require("fs")


function ask(something, callback) {
    /* 
     * Simple method to request user input
     */
    process.stdin.resume();
    process.stdout.write(something);
    process.stdin.once("data", function (data) {
        data = data.toString().trim()
        callback(data)
    })
}

function convert(str, config) {
    /* Replace some variables in the templates. 
     * It is used to insert the title and date
     * of creation of the template into the template.
     * It could be used later to review revisions manually
     *
     * But it has no effect on how the template will works.
     */

    for (name in config) {
        str = str.replace("{{" + name + "}}", config[name].toString())
    }

    return str
}

module.exports = function (path) {
    // Config that is used to render the templates 
    var config  = {
        title: "undefined",
        date: new Date()
    }

    // If the folder where the templates are saved doesn't 
    // exists, we create it.
    //
    // TODO ask user if he wants to create the folder
    // reduce magic as much as possible.
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }

    // Create the template using user input
    ask("title : ", function (data) {
        config.title = data
        content = "module.exports = " + convert(script_t, config) + ";"

        // Name of the template that will get saved... first the creation
        // date and then the title. The title should be stripped for illegal
        // characters in filenames.
        fs.writeFileSync(path + config.date.toJSON() + 
                         "@" + 
                         config.title + ".js", content)

        // Necessary as I use the process io instead of some better module... we
        // have to exit the process manually.
        process.exit()
    });
};
