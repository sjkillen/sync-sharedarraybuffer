(function () {
   "use strict";

   const D = new window.WorkerDispatcher("mutexTestWorker.js");

   describe("Mutex", function () {
      const { expect, assert } = chai;
      const numWorkers = 10;
      const numIter = 500000 / numWorkers

      it(`Increments to ${numIter} using ${numWorkers} workers`, function (done) {
         this.timeout(2000);
         const sab = new SharedArrayBuffer(1024);
         const m = new Cephalopod.Mutex(sab, 0);
         const heap = new Int32Array(sab);

         const test = new D.Test();
         test.setupTask("incrementTest", { sab: sab, numIter: numIter }, numWorkers)
            .then(() => {
               expect(heap[1]).to.equal(numIter * numWorkers);
            }).then(done).catch(done).then(() => test.cleanup());
      })

      //expects a failure to be caused by a race conditino between workers.
      //if failure does not occurr, number of workers, or number of iterations may be insufficient
      //to cause race condition. Try increasing numIter.
      it(`Fails without locks`, function (done) {
         this.timeout(2000);
         const sab = new SharedArrayBuffer(1024);
         const heap = new Int32Array(sab);
         const test = new D.Test;
         test.setupTask("incrementFail", { sab: sab, numIter: numIter }, numWorkers)
            .then(() => { expect(heap[1]).not.to.equal(numIter * 100 * numWorkers); })
            .then(done).catch(done)
            .then(() => test.cleanup());
      })

      it(`Tests ownership of locks`, function (done) {
         this.timeout(2000);
         const sab = new SharedArrayBuffer(1024);
         const m = new Cephalopod.Mutex(sab, 0);
         const heap = new Int32Array(sab);

         const test = new D.Test;
         test.setupTask("grabLock", sab)
            .then(() => test.setupTask("falseUnlock", { sab: sab, numIter: numIter }, 1))
            .then(() => done(new Error("Invalid unlock did not throw")))
            .catch(() => done())
            .then(() => test.cleanup());
      })

      it('gets try lock', function (done) {
         const sab = new SharedArrayBuffer(1024);
         const m = new Cephalopod.Mutex(sab, 0);
         const heap = new Int32Array(sab);
         const test = new D.Test;
         test.setupTask("tryLock", sab)
            .then(() => done())
            .catch(() => done(new Error("Try lock failed")))
            .then(() => test.cleanup());
      })

      it(`doesn't get try lock when already locked`, function (done) {
         const sab = new SharedArrayBuffer(1024);
         const m = new Cephalopod.Mutex(sab, 0);
         const heap = new Int32Array(sab);
         const test = new D.Test;
         test.setupTask("grabLock", sab)
            .then(() => setup("tryLock", sab))
            .then(() => done(new Error("try lock succeeded")))
            .catch(() => done())
            .then(() => test.cleanup());
      })
   });
}());