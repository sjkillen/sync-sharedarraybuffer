# Cephalopod
A collection of synchronization primitives for use with SharedArrayBuffer and Atomics

*!Note This module requires Atomics and SharedArrayBuffer. At the time of writing, only Firefox Nightly and Chrome Canary are compatible*

Included primitives (more to come)
- Mutex (binary)
- Semaphore

Usage (UMD module)

**CommonJS / Nodejs**
```js
const Cephalopod = require("cephalopod-sync-sharedarraybuffer");
```

**ES6 / Typescript**
```js
import { Mutex, Semaphore } from "cephalopod-sync-sharedarraybuffer";
// or
import * as Cephalopod from "cephalopod-sync-sharedarraybuffer";
```

**Browser**
```html
<script src="node_modules/cephalopod-sync-sharedarraybuffer/dist/lib.js"></script>
<script>
   window.Cephalopod;
</script>
```

## Mutex
Binary mutex that protects a SharedArrayBuffer  

Construct a view of a mutex in a buffer at offset 0
```js
const Mutex = Cephalopod.Mutex;
const mutex = new Mutex(new SharedArrayBuffer(Mutex.sizeof), 0);
```
Mutex will be unlocked if created on a new zero'd out array. Use init if array is not zero'd out.
```js
mutex.init();
```
Block until lock is obtained
```js
mutex.lock();
```
Unlock mutex 
```js
mutex.unlock();
```

Grab lock if its available, otherwise return false
```js
if (mutex.tryLock()) {
   // Do stuff
   mutex.unlock();
}
```

## Semaphore
Construct a view of a semaphore in a buffer at offset 0
```js
const Semaphore = Cephalopod.Semaphore;
const semaphore = new Semaphore(new SharedArrayBuffer(Semaphore.sizeof), 0);
```

Initialize the semaphore counter to 10
```js
semaphore.init(10);
```

Increment the counter
```js
semaphore.post();
```

Decrement the counter, and block if counter < 0
```js
semaphore.wait();
```

Decrement the counter if it is > 0, otherwise return false
```js
if (semaphore.tryWait()) {
   // do stuff
}
```

## Misc

Get the size of a sync primitive
```
Semaphore.sizeof;
semaphore.sizeof;
Mutex.sizeof;
mutex.sizeof;
```