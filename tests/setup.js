window.getSetup = function (workerFile) {
   return function setup(test, sab, numWorkers = 1) {
      const workers = []
      let finished = 0
      return new Promise((resolve, reject) => {
         for (x = 0; x < numWorkers; x++) {
            nw = new Worker(workerFile)
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
   };
}