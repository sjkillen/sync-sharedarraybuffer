self.addEventListener("message", msg => {
    console.log("Message recieved");
    const heap = new Int32Array(msg.data.buff);
    setInterval(() => console.log("Data is", heap[0]), 1000);
});

self.onmessage = () => {
    console.log("Work Work");
}
