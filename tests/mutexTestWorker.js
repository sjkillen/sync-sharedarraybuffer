self.importScripts("/dist/lib.js")
const commands = {
  incrementTest({sab, numIter}) {
    const m = new Cephalopod.Mutex(sab, 0);
    const heap = new Int32Array(sab);
    for (x = 0; x<numIter; x++) {
      m.lock();
      heap[1]++;
      m.unlock();
    }
    self.postMessage("done")
  },
  incrementFail({sab, numIter}) {
    const heap = new Int32Array(sab);
    for (x = 0; x<numIter*100; x++) { //needs to increase the workload to offset the lack of mutex grabbing to ensure context switching
      heap[1]++;
    }
    self.postMessage("done")
  }
}

self.addEventListener("message", msg => {
  commands[msg.data.command](msg.data.data)
});
