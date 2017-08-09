(function () {
   "use strict";

   const setup = window.getSetup("semaphoreTestWorker.js");

   describe("Semaphore", function () {
      const { expect, assert } = chai;
      const numWorkers = 10;
      const numIter = 500000 / numWorkers

      it(`Can be used as a lock`, function (done) {
         this.timeout(2000);
         const sab = new SharedArrayBuffer(1024);
         const s = new Cephalopod.Semaphore(sab, 0);
         s.init(1);
         const heap = new Int32Array(sab);

         setup("incrementTest", {
            sab: sab,
            numIter: numIter
         }, numWorkers).then(() => {
            expect(heap[1]).to.equal(numIter * numWorkers);
         }).then(done).catch(done)
      });
   });
}())