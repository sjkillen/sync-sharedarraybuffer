"use strict";

self.importScripts("/dist/lib.js")
const commands = {
   grabLock(sab) {
      const m = new Cephalopod.Mutex(sab, 0);
      const heap = new Int32Array(sab);
      m.lock();
      self.postMessage("done")
   },
   falseUnlock({ sab, numIter }) {
      const m = new Cephalopod.Mutex(sab, 0);
      const heap = new Int32Array(sab);
      try {
         m.unlock();
         self.postMessage("done");
      } catch (e) {
         self.postMessage("fail");
      }
   },
   tryLock(sab) {
      const m = new Cephalopod.Mutex(sab, 0);
      const heap = new Int32Array(sab);
      try {
         if (m.tryLock()) {
            self.postMessage("done");
         } else {
            self.postMessage("fail");
         }
      } catch (e) {
         self.postMessage("fail");
      }
   },
   incrementTest({ sab, numIter }) {
      const m = new Cephalopod.Mutex(sab, 0);
      const heap = new Int32Array(sab);
      for (let x = 0; x < numIter; x++) {
         m.lock();
         heap[1]++;
         m.unlock();
      }
      self.postMessage("done")
   },
   incrementFail({ sab, numIter }) {
      const heap = new Int32Array(sab);
      for (let x = 0; x < numIter * 100; x++) { //needs to increase the workload to offset the lack of mutex grabbing to ensure context switching
         heap[1]++;
      }
      self.postMessage("done")
   }
}

self.addEventListener("message", msg => {
   commands[msg.data.command](msg.data.data)
});
