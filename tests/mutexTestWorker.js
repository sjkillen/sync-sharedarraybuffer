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
  }
}

self.addEventListener("message", msg => {
  commands[msg.data.command](msg.data.data)
});
