module.exports = function (context) {
    /*
     * {{title}}
     * {{date}}
     */
    context.up(function (designs) {
        /*
        designs.create("projects")
               .setView("list", function (doc) {
                   emit(null, {"a": 2});
               });
        */
    });

    context.down(function (designs) {
        /*
        designs.remove("projects");
        */
    });
};
