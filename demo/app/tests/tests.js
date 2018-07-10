var MutualTls = require("nativescript-mutual-tls").MutualTls;
var mutualTls = new MutualTls();

describe("greet function", function() {
    it("exists", function() {
        expect(mutualTls.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(mutualTls.greet()).toEqual("Hello, NS");
    });
});