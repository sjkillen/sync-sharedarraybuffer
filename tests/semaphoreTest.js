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
                        .then(() => test.setupTask("tryWait", sab, 1)
                              .then(() => done(new Error("tryWait got lock when it should not have")))
                              .catch(() => done())
                        )
                        .catch(() => done(new Error("tryWait did not get lock")))
                        .then(() => test.cleanup())
            });

            it('uses its counter to determine if wait blocks', function () {
                  this.timeout(2000);
                  const test = new D.Test;
                  const sab = new SharedArrayBuffer(1024);
                  const s = new Cephalopod.Semaphore(sab, 0);
                  const heap = new Int32Array(sab, s.sizeof, 1);
                  s.init(1);
                  test.setupTask("depleteCounter", sab, 20)
                        .then()
            });
      });
}())