"use strict";

var util = require("util");
var EventEmitter = require("events").EventEmitter;

var DEBUG = process.env.MOCK_STREAM_DEBUG;

function makeString(data) {
    if (Buffer.isBuffer(data)) {
        data = data.toString("utf8");
    }

    return data;
}

function WRITE(data) {
    this.emit("data", makeString(data));
}

function NOOP() {}

/**
 * @class MockReadableStream
 * @constructor
 * @extends YetiEventEmitter
 */
function MockReadableStream() {
    EventEmitter.call(this);
}

util.inherits(MockReadableStream, EventEmitter);

MockReadableStream.prototype.isTTY = false;

/**
 * No-op.
 *
 * @method setEncoding
 */
MockReadableStream.prototype.setEncoding = NOOP;

/**
 * No-op.
 *
 * @method resume
 */
MockReadableStream.prototype.resume = NOOP;

/**
 * No-op.
 *
 * @method pause
 */
MockReadableStream.prototype.pause = NOOP;

/**
 * No-op.
 *
 * @method destroy
 */
MockReadableStream.prototype.destroy = NOOP;

/**
 * Emit the `data` event with first argument
 * as a String.
 *
 * @method write
 * @param {String|Buffer} data Data.
 */
MockReadableStream.prototype.write = WRITE;

/**
 * @class MockWritableStream
 * @constructor
 * @extends YetiEventEmitter
 */
function MockWritableStream() {
    var self = this;

    EventEmitter.call(self);

    if (DEBUG) {
        self.id = (Math.random() * 100000) | 0;
    }

    self.dataEvents = [];
    self.dataListener = null;

    Object.defineProperty(self, "capturedData", {
        get: function () {
            return self.dataEvents.join("");
        }
    });
}

util.inherits(MockWritableStream, EventEmitter);

MockWritableStream.prototype.isTTY = false;

/**
 * No-op.
 *
 * @method end
 */
MockWritableStream.prototype.end = NOOP;

/**
 * Emit the `data` event with first argument
 * as a String.
 *
 * @method write
 * @param {String|Buffer} data Data.
 */
MockWritableStream.prototype.write = WRITE;

/**
 * Begin capturing data events into an internal buffer
 * which can be accessed by the `capturedData` property.
 *
 * @method startCapture
 */
MockWritableStream.prototype.startCapture = function () {
    var self = this;

    self.clearCapturedData();

    if (!self.dataListener) {
        self.dataListener = function ondata(data) {
            data = makeString(data);
            self.dataEvents.push(data);
        };

        self.on("data", self.dataListener);
    }
};

MockWritableStream.prototype.captureData = function () {
    console.error("captureData() is deprecated, use startCapture() instead");
    MockWritableStream.prototype.startCapture.call(this);
};

/**
 * Stop capturing data events into an internal buffer.
 *
 * @method stopCapture
 */
MockWritableStream.prototype.stopCapture = function () {
    if (this.dataListener) {
        this.removeListener("data", this.dataListener);
    }
};

/**
 * Reset the internal data events buffer.
 *
 * @method clearCapturedData
 */
MockWritableStream.prototype.clearCapturedData = function () {
    this.dataEvents = [];
};


/**
 * Call the given callback when expectedString
 * is written to this stream. The callback recieves
 * a string of all data written since the expect call.
 *
 * @method expect
 * @param {String} expectedString Expected string.
 * @param {Function} cb Callback.
 * @param {null} cb.err Error for callback, always null.
 * @param {String} cb.data All data written between expectedString
 * appearing and calling expect.
 */
MockWritableStream.prototype.expect = function (expectedString, cb) {
    var self = this,
        what,
        dataEvents = [];

    if (DEBUG) {
        what = "MockWritableStream<" + self.id + ">#expect:";
        console.log(what, "Expecting:", expectedString);
    }

    self.on("data", function ondata(data) {
        data = makeString(data);

        dataEvents.push(data);

        if (DEBUG) {
            console.log(what, "Collecting:", data);
        }

        if (expectedString && data.indexOf(expectedString) !== -1) {
            self.removeListener("data", ondata);
            cb(null, dataEvents.join(""));
        }
    });
};

exports.MockReadableStream = MockReadableStream;
exports.MockWritableStream = MockWritableStream;
