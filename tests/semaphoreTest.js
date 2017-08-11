(function () {
   "use strict";

   const D = new window.WorkerDispatcher("semaphoreTestWorker.js");

   describe("Semaphore", function () {
      const { expect, assert } = chai;
      const numWorkers = 1;
      const numIter = 500 / numWorkers

      it(`Can be used as a lock`, function (done) {
         this.timeout(2000);
         const sab = new SharedArrayBuffer(1024);
         const s = new Cephalopod.Semaphore(sab, 0);
         s.init(1);
         const heap = new Int32Array(sab);

         const test = new D.Test();
         test.setupTask({
            sab: sab,
            numIter: numIter
         }, numWorkers);

         test.then(() => {
            expect(heap[1]).to.equal(numIter * numWorkers);
         }).then(done).catch(done).then(() => test.cleanup());
      });
   });
}())