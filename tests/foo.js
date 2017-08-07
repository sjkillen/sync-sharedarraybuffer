const sab = new SharedArrayBuffer(1024);
const worker = new Worker("work.js");


worker.postMessage({buff: sab});

const heap = new Int32Array(sab);
setInterval(() => heap[0]++, 1000);