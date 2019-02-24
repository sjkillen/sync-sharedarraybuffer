import { Sized } from "./Sized";
/**
 * Counting semaphore
 */
export declare class Semaphore implements Sized {
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
