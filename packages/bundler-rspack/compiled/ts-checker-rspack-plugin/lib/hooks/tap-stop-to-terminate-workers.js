"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tapStopToTerminateWorkers = void 0;
const infrastructure_logger_1 = require("../infrastructure-logger");
function tapStopToTerminateWorkers(compiler, getIssuesWorker, getDependenciesWorker, state) {
    const { debug } = (0, infrastructure_logger_1.getInfrastructureLogger)(compiler);
    const terminateWorkers = () => {
        debug('Compiler is going to close - terminating workers...');
        getIssuesWorker.terminate();
        getDependenciesWorker.terminate();
    };
    compiler.hooks.watchClose.tap('TsCheckerRspackPlugin', () => {
        terminateWorkers();
    });
    compiler.hooks.done.tap('TsCheckerRspackPlugin', () => {
        if (!state.watching) {
            terminateWorkers();
        }
    });
    compiler.hooks.failed.tap('TsCheckerRspackPlugin', () => {
        if (!state.watching) {
            terminateWorkers();
        }
    });
}
exports.tapStopToTerminateWorkers = tapStopToTerminateWorkers;
