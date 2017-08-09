
describe("Testing Mutex Functionality", function () {
   const {
    expect,
      assert
  } = chai;
   const numWorkers = 10;
   const numIter = 500000 / numWorkers



   it(`Increments to ${numIter} using ${numWorkers} workers`, function (done) {
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
   it(`Fails without locks`, function (done) {
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

   it(`Tests ownership of locks`, function (done) {
      this.timeout(2000);
      const sab = new SharedArrayBuffer(1024);
      const m = new Cephalopod.Mutex(sab, 0);
      const heap = new Int32Array(sab);
      setup("grabLock", sab).then(
         () => setup("falseUnlock", {
            sab: sab,
            numIter: numIter
         }, 1)
      )
         .then(() => done(new Error("Invalid unlock did not throw")))
         .catch(() => done())
   })

   it('gets try lock', function (done) {
      const sab = new SharedArrayBuffer(1024);
      const m = new Cephalopod.Mutex(sab, 0);
      const heap = new Int32Array(sab);
      setup("tryLock", sab)
         .then(() => done())
         .catch(() => done(new Error("Try lock failed")))
   })

   it(`doesn't get try lock when already locked`, function (done) {
      const sab = new SharedArrayBuffer(1024);
      const m = new Cephalopod.Mutex(sab, 0);
      const heap = new Int32Array(sab);
      setup("grabLock", sab)
         .then(() => setup("tryLock", sab))
         .then(() => done(new Error("try lock succeeded")))
         .catch(() => done())
   })
});


function setup(test, sab, numWorkers = 1) {
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
            } else if (msg.data === "fail") {
               reject();
            } else {
               throw new Error("Invalid message from thread");
            }
         })
      }
   })
}
