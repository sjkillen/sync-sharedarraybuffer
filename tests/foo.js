describe("Using mocha", function() {
    const { expect } = chai;
    it("Works?", () => {
        const m = new Cephalopod.Mutex;
        expect(m.foo());
    })
});