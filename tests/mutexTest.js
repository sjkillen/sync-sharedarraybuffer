describe("Testing Mutex Functionality", function() {
  const {
    expect,
    assert
  } = chai;
  const numWorkers = 10;
  const numIter = 500000 / numWorkers



  it(`Increments to ${numIter} using ${numWorkers} workers`, function(done) {
    this.timeout(2000);
    const sab = new SharedArrayBuffer(1024);
    const m = new Cephalopod.Mutex(sab, 0);
    const heap = new Int32Array(sab);

    setup("incrementTest", {
      sab: sab,
      numIter: numIter
    }, numWorkers).then(
      () => {
        expect(heap[1]).to.equal(numIter * numWorkers);
      }
    ).then(done).catch(done)
  })

  //expects a failure to be caused by a race conditino between workers.
  //if failure does not occurr, number of workers, or number of iterations may be insufficient
  //to cause race condition. Try increasing numIter.
  it(`Fails without locks`, function(done) {
    this.timeout(2000);
    const sab = new SharedArrayBuffer(1024);
    const heap = new Int32Array(sab);
    setup("incrementFail", {
      sab: sab,
      numIter: numIter
    }, numWorkers).then(
      () => {
        expect(heap[1]).not.to.equal(numIter * 100 * numWorkers);
      }
    ).then(done).catch(done)
  })

  it(`Tests ownership of locks`, function(done) {
       this.timeout(2000);
       const sab = new SharedArrayBuffer(1024);
       const m = new Cephalopod.Mutex(sab, 0);
       const heap = new Int32Array(sab);
       setup("grabLock", {
         sab: sab,
         numIter: numIter
       }, numWorkers).then(
         () => {
           //expect(heap[1]).to.equal(numIter * numWorkers);
         }
       ).then(done).catch(done)
       setup("falseUnlock", {
         sab: sab,
         numIter: numIter
       }, numWorkers).then(
         () => {
           //expect(heap[1]).to.equal(numIter * numWorkers);
         }
       ).then(() => done().catch(() => done()),Error,"Attempt to unlock mutex that is not owned by thread")
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
