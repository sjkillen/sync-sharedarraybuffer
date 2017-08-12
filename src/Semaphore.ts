import { Mutex } from "./Mutex";
import { Sized } from "./Sized";

/**
 * Counting semaphore
 */
export class Semaphore implements Sized {
   private counter: Int32Array;
   private mutex: Mutex;

   constructor(buff: SharedArrayBuffer, offset: number) {
      this.counter = new Int32Array(buff, offset, 1);
      this.mutex = new Mutex(buff, offset + 4);
      this.sizeof = this.mutex.sizeof + 4;
   }

   /**
    * Initialize the semaphore's counter
    * @param value set semaphore as
    */
   init(value: number) {
      this.counter[0] = value;
   }

   /**
    * Decrement the counter and block if the counter is < 1
    */
   wait() {
      this.mutex.lock();
      this.counter[0] -= 1;
      for (; ;) {
         if (this.counter[0] >= 0) {
            this.mutex.unlock();
            return;
         }
         const counter = this.counter[0];
         this.mutex.unlock();
         // if this.counter[0] changes in between unlock and wait, wait will not wait
         Atomics.wait(this.counter, 0, counter);
         this.mutex.lock();
      }
   }

   /**
    * Decrement the counter if it is > 0 and return true
    * otherwise return false
    * Does not block
    * @returns whether counter was decremented
    */
   tryWait(): boolean {
      this.mutex.lock();
      const didConsume = this.counter[0] > 0;
      if (didConsume) {
         this.counter[0]--;
      }
      this.mutex.unlock();
      return didConsume;
   }

   /**
    * Increment the counter, wake up any waiting threads
    */
   post() {
      this.mutex.lock();
      this.counter[0]++;
      this.mutex.unlock();
      Atomics.wake(this.counter, 0, 1);
   }

   readonly sizeof: number;
}
