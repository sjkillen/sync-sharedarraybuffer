describe("Testing Mutex", function() {
    const { expect } = chai;
    it("Works?", () => {
        var m = new Cephalopod.Mutex;
        m.state = locked;
        expect(m.foo()).to.equal(true);
        expect(m.state).to.equal(4);
    })
});
