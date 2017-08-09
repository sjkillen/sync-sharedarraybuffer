export class Semaphore {
  private sem: Int32Array;
  private sab: SharedArrayBuffer;
  private offset: number;
  constructor(buff: SharedArrayBuffer, offset: number) {
    this.sab=buff;
    this.offset = offset;
  }

  init(limit:number){
    this.sem = new Int32Array(this.sab, this.offset, limit);
  }

  wait() {
    for (; ;) {
      const old = Atomics.sub(this.sem, 0, 1);
      if (old == State.unlocked) {
        this.isOwner = true;
        return;
      } else {
        Atomics.wait(this.state, 0, State.locked);
      }
    }
  }

  post() {
    Atomics.add(this.sem,this.offset,1);
  }
  readonly sizeof = 8;
}
