var expect = require("chai").expect
    , Design = require("../src/design.js")

describe("Design", function() {
    describe("#new()", function() {
        it("should be possible to create a Design", function() {
            var design = new Design("test")
            expect(design).to.be.instanceof(Design)
        })

        it("should have a name", function() {
            var design = new Design("test")
            expect(design.name).equal("test")

            design = new Design("fun")
            expect(design.name).equal("fun")
        })

        it("should have an empty dict for views", function () {
            var design = new Design("test")
                , count = 0

            for(key in design.views) {
                count += 1
            }

            expect(count).equal(0)
        })
    })

    describe("#getId()", function() {
        it("should have an id using its name", function () {
            var design = new Design("test")
            expect(design.getId()).equal("_design/test")

            design = new Design("test2")
            expect(design.getId()).equal("_design/test2")
        }) 
    })
})
