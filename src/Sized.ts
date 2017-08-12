/**
 * Stores data in a SharedArrayBuffer
 */
export interface Sized {
   /**
    * Size in bytes that class requires
    */
   readonly sizeof: number;
}