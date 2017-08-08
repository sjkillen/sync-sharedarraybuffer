describe("Testing Mutex", function() {
  const {
    expect
  } = chai;


  it("Increment Test", done => {
    const sab = new SharedArrayBuffer(1024);
    const m = new Cephalopod.Mutex(sab, 0);
    setup("incrementTest", sab);
    const heap = new Int32Array(sab);
    console.log(heap.length)
    setTimeout(
      () => {
        expect(heap[1]).to.equal(2000000);
        console.log(heap[1])
        done();
      }, 5000
    )
  })
});

function setup(test, sab) {

  const worker = new Worker("mutexTestWorker.js");
  const worker2 = new Worker("mutexTestWorker.js");

  worker.postMessage({ command: test, data: sab });
  worker2.postMessage({ command: test, data: sab });
}
