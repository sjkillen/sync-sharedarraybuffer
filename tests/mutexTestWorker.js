self.importScripts("/dist/lib.js")
const commands = {
  incrementTest(sab) {
    const m = new Cephalopod.Mutex(sab, 0);
    const heap = new Int32Array(sab);
    console.log("im starting")
    for (x = 0; x<1000000; x++) {
      m.lock();
      heap[1]++;
      m.unlock();
    }
    self.postMessage("done")
    console.log("Im done");
  }
}

self.addEventListener("message", msg => {
  commands[msg.data.command](msg.data.data)
});
