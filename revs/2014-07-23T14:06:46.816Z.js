module.exports = function (context) {
    context.up(function (designs) {
        designs.create("trs")
           .setView("fun", function (doc) {

           })
           .setValidateDocUpdate(function(newDoc, oldDoc, userCtx) {
                return true;
           });
    }); 

    context.down(function (designs) {
        designs.remove("trs");
    });
};
