import { Mutex } from "./Mutex";

export class Semaphore {
  private counter: Int32Array;
  private mutex: Mutex;
  constructor(buff: SharedArrayBuffer, offset: number) {
    this.counter = new Int32Array(buff, offset, 1);
    this.mutex = new Mutex(buff, offset + 4);
    this.sizeof = this.mutex.sizeof + 4;
  }

  init(v: number) {
    this.counter[0] = v;
  }

  wait() {
    this.mutex.lock();
    this.counter[0] -= 1;
    for (; ;) {
      if (this.counter[0] < 0) {
        const counter = this.counter[0];
        this.mutex.unlock();
        // if this.counter[0] changes in between unlock and wait, wait will not wait
        Atomics.wait(this.counter, 0, counter);
      } else {
        this.mutex.unlock();
        return;
      }
      this.mutex.lock();
    }
  }

  tryWait(): boolean {
    this.mutex.lock();
    this.counter[0]--;
    this.mutex.unlock();
    return true;

    return false;
  }

  post() {

  }
  readonly sizeof: number;
}
