"use strict";

self.importScripts("/dist/lib.js")
const commands = {
   incrementTest({ sab, numIter }) {
      const s = new Cephalopod.Semaphore(sab, 0);
      const heap = new Int32Array(sab, s.sizeof, 1);
      try {
         for (let x = 0; x < numIter; x++) {
            s.wait();
            heap[0]++;
            s.post();
         }
         self.postMessage("done");
      } catch (e) {
         self.postMessage("fail");
      }
   },
   tryWait(sab) {
      const s = new Cephalopod.Semaphore(sab, 0);

      if (s.tryWait()) {
         self.postMessage("done");
      } else {
         self.postMessage("fail");
      }
   },
   failTryWait(sab) {
      const s = new Cephalopod.Semaphore(sab, 0);

      if (s.tryWait()) {
         self.postMessage("fail");
      } else {
         self.postMessage("done");
      }
   }
}

self.addEventListener("message", msg => {
   commands[msg.data.command](msg.data.data);
});
