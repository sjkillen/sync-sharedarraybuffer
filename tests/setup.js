(function () {
   "use strict";

   function setup(workerFile, command, sab, numWorkers = 1) {
      const workers = []
      let finished = 0
      function terminate() {
         for (const worker of workers) {
            worker.terminate();
         }
      }
      return [terminate, new Promise((resolve, reject) => {
         for (let x = 0; x < numWorkers; x++) {
            const nw = new Worker(workerFile)
            nw.postMessage({
               command,
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
      })];
   };


   class WorkerDispatcher {
      constructor(workerFile) {
         this.Test =
            class Test {
               constructor() {
                  this.toCleanup = [];
               }
               setupTask(command, sab, numWorkers = 1) {
                  const [cleanup, task] = setup(workerFile, command, sab, numWorkers);
                  this.toCleanup.push(cleanup);
                  return task;
               }
               cleanup() {
                  this.toCleanup.forEach(c => c());
               }
            }
      }
   }

   window.WorkerDispatcher = WorkerDispatcher;

}())
