declare module "Sized" {
    /**
     * Stores data in a SharedArrayBuffer
     */
    export interface Sized {
        /**
         * Size in bytes that class requires
         */
        readonly sizeof: number;
    }
}
declare module "Mutex" {
    import { Sized } from "Sized";
    /**
     * Binary mutex that protects a SharedArrayBuffer
     */
    export class Mutex implements Sized {
        private state;
        private isOwner;
        /**
         * Construct a view of a mutex in a buffer
         * @param buff to store mutex in
         * @param offset into buff to store mutex
         */
        constructor(buff: SharedArrayBuffer, offset: number);
        /**
         * Initializes the mutex to be unlocked
         * This function doesn't need to be called if the SharedArrayBuffer
         * being used is zero'd
         */
        init(): void;
        /**
         * Obtain the lock, blocks until lock is acquired
         * Cannot be called on main thread
         */
        lock(): void;
        /**
         * Release the lock
         * @throws err if thread does not hold the lock
         */
        unlock(): void;
        /**
         * Attempt to acquire the lock, but returns immediately if lock cannot be obtained
         * @returns whether lock was aqcuired
         */
        tryLock(): boolean;
        static readonly sizeof = 4;
        readonly sizeof = 4;
    }
}
declare module "Semaphore" {
    import { Sized } from "Sized";
    /**
     * Counting semaphore
     */
    export class Semaphore implements Sized {
        private counter;
        private mutex;
        constructor(buff: SharedArrayBuffer, offset: number);
        /**
         * Initialize the semaphore's counter
         * @param value set semaphore as
         */
        init(value: number): void;
        /**
         * Decrement the counter and block if the counter is < 1
         */
        wait(): void;
        /**
         * Decrement the counter if it is > 0 and return true
         * otherwise return false
         * Does not block
         * @returns whether counter was decremented
         */
        tryWait(): boolean;
        /**
         * Increment the counter, wake up any waiting threads
         */
        post(): void;
        static readonly sizeof: number;
        readonly sizeof: number;
    }
}
declare module "main" {
    export * from "Mutex";
    export * from "Semaphore";
}
