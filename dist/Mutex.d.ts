import { Sized } from "./Sized";
/**
 * Binary mutex that protects a SharedArrayBuffer
 */
export declare class Mutex implements Sized {
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
