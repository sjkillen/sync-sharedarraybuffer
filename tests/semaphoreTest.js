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
                  const heap = new Int32Array(sab, s.sizeof, 1);

                  const test = new D.Test();
                  test.setupTask("incrementTest", {
                        sab: sab,
                        numIter: numIter
                  }, numWorkers)
                        .then(() => {
                              expect(heap[0]).to.equal(numIter * numWorkers);
                        }).then(done).catch(done).then(() => test.cleanup());
            });

            it("tryWait returns immediately with status", function (done) {
                  this.timeout(2000);
                  const sab = new SharedArrayBuffer(1024);
                  const s = new Cephalopod.Semaphore(sab, 0);
                  s.init(1);
                  const heap = new Int32Array(sab, s.sizeof, 1);

                  const test = new D.Test();
                  test.setupTask("tryWait", sab, 1)
                        .then(() => test.setupTask("failTryWait", sab, 1))
                        .then(() => done())
                        .catch(() => done(new Error("tryWait failed")))
                        .then(() => test.cleanup())
            });

            it('uses its counter to determine if wait blocks', function (done) {
                  this.timeout(5000);
                  const counter = 30;
                  const test = new D.Test;
                  const sab = new SharedArrayBuffer(1024);
                  const s = new Cephalopod.Semaphore(sab, 0);
                  const heap = new Int32Array(sab, s.sizeof, 1);
                  s.init(counter);

                  test.setupTask("tryWait", sab, counter)
                        .then(() => test.setupTask("failTryWait", sab, 1))
                        .then(done)
                        .catch(() => done(new Error))
            });
      });
}())