const enum State {
   unlocked = 0,
   locked
}

/**
 * Binary mutex that protects a SharedArrayBuffer
 */
export class Mutex {
   private state: Int32Array;
   private isOwner: boolean;

   /**
    * Construct a view of a mutex in a buffer, but doen't initialize it
    * @param buff to store mutex in
    * @param offset into buff to store mutex
    */
   constructor(buff: SharedArrayBuffer, offset: number) {
      this.state = new Int32Array(buff, offset, 1);
   }

   /**
    * Initializes the mutex to be unlocked
    * This function doesn't need to be called if the SharedArrayBuffer
    * being used is zero'd
    */
   init() {
      if (this.isOwner) {
         throw new Error("Mutex in use, cannot initialize");
      }
      this.state[0] = State.unlocked;
   }

   /**
    * Obtain the lock, blocks until lock is acquired
    * Cannot be called on main thread
    */
   lock() {
      if (this.isOwner) {
         throw new Error("Thread tried to lock mutex twice");
      }
      for (; ;) {
         const old = Atomics.compareExchange(this.state, 0, State.unlocked, State.locked);
         if (old == State.unlocked) {
            this.isOwner = true;
            return;
         } else {
            Atomics.wait(this.state, 0, State.locked);
         }
      }
   }

   /**
    * Release the lock
    * @throws err if thread does not hold the lock
    */
   unlock() {
      if (!this.isOwner) {
         throw new Error("Attempt to unlock mutex that is not owned by thread")
      }
      this.isOwner = false;
      Atomics.store(this.state, 0, State.unlocked);
      Atomics.wake(this.state, 0, 1)
   }

   /**
    * Attempt to acquire the lock, but returns immediately if lock cannot be obtained
    * @returns whether lock was aqcuired
    */
   tryLock(): boolean {
      if (this.isOwner) {
         throw new Error("Thread tried to lock mutex twice");
      }
      const old = Atomics.compareExchange(this.state, 0, State.unlocked, State.locked);
      if (old == State.unlocked) {
         return true;
      }
      return false;
   }
   readonly sizeof = 4;
}
