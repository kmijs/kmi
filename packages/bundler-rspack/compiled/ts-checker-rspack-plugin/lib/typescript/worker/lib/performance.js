"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printPerformanceMeasuresIfNeeded = exports.disablePerformanceIfNeeded = exports.enablePerformanceIfNeeded = void 0;
const typescript_1 = require("./typescript");
const worker_config_1 = require("./worker-config");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const performance = typescript_1.typescript.performance;
function enablePerformanceIfNeeded() {
    if (worker_config_1.config.profile) {
        performance?.enable?.();
    }
}
exports.enablePerformanceIfNeeded = enablePerformanceIfNeeded;
function disablePerformanceIfNeeded() {
    if (worker_config_1.config.profile) {
        performance?.disable?.();
    }
}
exports.disablePerformanceIfNeeded = disablePerformanceIfNeeded;
function printPerformanceMeasuresIfNeeded() {
    if (worker_config_1.config.profile) {
        const measures = {};
        performance?.forEachMeasure?.((measureName, duration) => {
            measures[measureName] = duration;
        });
        console.table(measures);
    }
}
exports.printPerformanceMeasuresIfNeeded = printPerformanceMeasuresIfNeeded;
