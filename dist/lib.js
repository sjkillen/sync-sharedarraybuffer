(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Cephalopod"] = factory();
	else
		root["Cephalopod"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Mutex {
    constructor(buff, offset) {
        this.sizeof = 4;
        // TODO Atomics.isLockFree()?
        this.state = new Int32Array(buff, offset, 1);
    }
    lock() {
        if (this.isOwner) {
            throw new Error("Thread tried to lock mutex twice");
        }
        for (;;) {
            const old = Atomics.compareExchange(this.state, 0, 0 /* unlocked */, 1 /* locked */);
            if (old == 0 /* unlocked */) {
                this.isOwner = true;
                return;
            }
            else {
                Atomics.wait(this.state, 0, 1 /* locked */);
            }
        }
    }
    unlock() {
        if (!this.isOwner) {
            throw new Error("Attempt to unlock mutex that is not owned by thread");
        }
        this.isOwner = false;
        Atomics.store(this.state, 0, 0 /* unlocked */);
        Atomics.wake(this.state, 0, 1);
    }
    tryLock() {
        if (this.isOwner) {
            throw new Error("Thread tried to lock mutex twice");
        }
        const old = Atomics.compareExchange(this.state, 0, 0 /* unlocked */, 1 /* locked */);
        if (old == 0 /* unlocked */) {
            return true;
        }
        return false;
    }
}
exports.Mutex = Mutex;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(0));
__export(__webpack_require__(2));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Mutex_1 = __webpack_require__(0);
class Semaphore {
    constructor(buff, offset) {
        this.counter = new Int32Array(buff, offset, 1);
        this.mutex = new Mutex_1.Mutex(buff, offset + 4);
        this.sizeof = this.mutex.sizeof + 4;
    }
    init(v) {
        this.counter[0] = v;
    }
    wait() {
        this.mutex.lock();
        this.counter[0] -= 1;
        for (;;) {
            if (this.counter[0] < 0) {
                const counter = this.counter[0];
                this.mutex.unlock();
                // if this.counter[0] changes in between unlock and wait, wait will not wait
                Atomics.wait(this.counter, 0, counter);
            }
            else {
                this.mutex.unlock();
                return;
            }
            this.mutex.lock();
        }
    }
    tryWait() {
        this.mutex.lock();
        this.counter[0]--;
        this.mutex.unlock();
        return true;
        return false;
    }
    post() {
    }
}
exports.Semaphore = Semaphore;


/***/ })
/******/ ]);
});