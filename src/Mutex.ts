const enum State {
  unlocked = 0,
  locked
}

export class Mutex {
  private state: Int32Array;
  private isOwner: boolean;
  constructor(buff: SharedArrayBuffer, offset: number) {
    // TODO Atomics.isLockFree()?
    this.state = new Int32Array(buff, offset, 1);
  }
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

  unlock() {
    if (!this.isOwner) {
      throw new Error("Attempt to unlock mutex that is not owned by thread")
    }
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
