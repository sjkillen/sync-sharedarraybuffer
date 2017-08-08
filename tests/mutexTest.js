describe("Testing Mutex", function() {
  const {
    expect
  } = chai;


  it("Increment Test", function (done) {
    this.timeout(20000);
    const sab = new SharedArrayBuffer(1024);
    const m = new Cephalopod.Mutex(sab, 0);
    const heap = new Int32Array(sab);
    const numWorkers = 1;
    const numIter = 1000000/numWorkers

    setup("incrementTest",{sab: sab, numIter: numIter}, numWorkers).then(
      () => {
        try {
          expect(heap[1]).to.equal(numIter * numWorkers);
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
        if (msg.data === "done") {
          finished++;
          if (finished == numWorkers) {
            resolve();
          }
        }
      })
    }
  })
}
