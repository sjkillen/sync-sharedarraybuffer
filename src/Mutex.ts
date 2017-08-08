const enum State {
  unlocked = 0,
  locked
}

export class Mutex {
  private state: Int32Array;
  constructor(buff: SharedArrayBuffer, offset: number) {
    // TODO Atomics.isLockFree()?
    this.state = new Int32Array(buff, offset, 1);
  }
  lock(): true {
  for (; ;) {
    const old = Atomics.compareExchange(this.state, 0, State.unlocked, State.locked);
    if (old == State.unlocked) {
      return true;
    } else {
      console.log("Im waiting")
      Atomics.wait(this.state, 0, State.locked);
    }
  }
}

unlock() {
  Atomics.store(this.state, 0, State.unlocked);
  Atomics.wake(this.state, 0, 1)
}
tryLock(): boolean {
  const old = Atomics.compareExchange(this.state, 0, State.unlocked, State.locked);
  if (old == State.unlocked) {
    return true;
  }
  return false;
}
readonly sizeof = 8;
}
