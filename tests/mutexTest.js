describe("Testing Mutex", function() {
  const {
    expect
  } = chai;


  it("Increment Test", function (done) {
    this.timeout(20000);
    const sab = new SharedArrayBuffer(1024);
    const m = new Cephalopod.Mutex(sab, 0);
    const heap = new Int32Array(sab);
    console.log(heap.length)

    setup("incrementTest", sab, 2).then(
      () => {
        console.log(heap[1])
        try {
          expect(heap[1]).to.equal(2000000);
          done();
        } catch (e) {
          done(e)
        }
      }
    )
  })
});

function setup(test, sab, numWorkers) {
  const workers = []
  let finished = 0
  return new Promise((resolve, reject) => {
    for (x = 0; x < numWorkers; x++) {
      nw = new Worker("mutexTestWorker.js")
      nw.postMessage({
        command: test,
        data: sab
      });
      workers.push(nw);
      nw.addEventListener("message", msg => {
        console.log("Clinet message")
        if (msg.data === "done") {
          finished++;
          if (finished == numWorkers) {
            console.log("done done")
            resolve();
          }
        }
      })
    }
  })
}
