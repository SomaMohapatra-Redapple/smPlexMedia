'use strict';

// Queue class constructor
const Queue = function () {
    this._queue = [];
};

// Queue class properties
Queue.prototype = {

    // Size property
    get size() {
        return this._queue.length;
    }

};

// Enqueue class method
Queue.prototype.enqueue = function (obj) {
    this._queue.push(obj);
    obj.inQueue = true;
};

// Dequeue class method
Queue.prototype.dequeue = function () {
    let obj = this._queue.shift();
    obj.inQueue = false;
    return obj;
};

// Queue remove class method
Queue.prototype.remove = function (obj) {
    this._queue.splice(this._queue.indexOf(obj), 1);
    obj.inQueue = false;
};

// Export Queue class
module.exports = Queue;