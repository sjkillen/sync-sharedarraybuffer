export class Mutex {
    private view: Int32Array;
    constructor(buff: SharedArrayBuffer, offset: number) {
        this.view = new Int32Array(buff, offset, Mutex.sizeof);
    }
    static readonly sizeof = 0;
}