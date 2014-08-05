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

    describe("#setView()", function() {
        it("be able to add views to the design", function () {
            var design = new Design("test")
                , map = function (doc) {}
                , map_str = map.toString()

            design.setView("fun", map)
            expect(design.views["fun"]["map"]).equal(map_str)
        })

        it("be able to add views to the design with a reduce function", function () {
            var design = new Design("test")
                , map = function (doc) {}
                , map_str = map.toString()
                , reduce = function (keys, values) {}
                , reduce_str = reduce.toString()

            design.setView("funny", map, reduce)
            expect(design.views["funny"]["reduce"]).equal(reduce_str)
        })
    })

    describe("#removeView()", function() {
        it("should be possible to remove a view", function () {
            var design = new Design("test")
                , map = function (doc) {}
                , map_str = map.toString()

            design.setView("fun", map)
            expect(design.views["fun"]["map"]).equal(map_str)

            design.removeView("fun")
            expect(design.views.hasOwnProperty("fun")).equal(false)
            expect(design.views.hasOwnProperty("funny")).equal(false)
        })
    })

    describe("#toObject()", function() {
        it("should be serialize to an object", function () {
            var design = new Design("test")
                , obj = design.toObject()

            expect(obj).to.be.an("object")
            expect(obj._id).equal(design.getId())
            expect(obj.language).equal("javascript")
            expect(obj.views).to.be.an("object")
            expect(Object.keys(obj.views).length).equal(0)
        })

        it("should be serialize to an object with views", function () { 
            var design = new Design("test")
                , map = function (doc) {}
                , map_str = map.toString()
                , obj = design.toObject()
                , reduce = function (keys, values) {}
                , reduce_str = reduce.toString()

            design.setView("fun", map)
            design.setView("funny", map, reduce)

            expect(obj).to.be.an("object")
            expect(obj._id).equal(design.getId())
            expect(obj.language).equal("javascript")
            expect(obj.views).to.be.an("object")
            expect(Object.keys(obj.views).length).equal(2)
            expect(obj.views["fun"]["map"]).equal(map_str)

            expect(obj.views["funny"]["map"]).equal(map_str)
            expect(obj.views["funny"]["reduce"]).equal(reduce_str)
        })
    })

    describe("#toString()", function() {
        it("should be serialize to a string", function () {
            var design = new Design("test")
                , obj = design.toObject()
                , obj_str = design.toString()

            expect(obj_str).to.be.a("string")
            expect(obj_str).equal(JSON.stringify(obj))
        })
    })
})
