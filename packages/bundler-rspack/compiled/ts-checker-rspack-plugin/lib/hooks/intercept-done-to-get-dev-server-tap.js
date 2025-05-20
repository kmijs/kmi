"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interceptDoneToGetDevServerTap = void 0;
const infrastructure_logger_1 = require("../infrastructure-logger");
function interceptDoneToGetDevServerTap(compiler, config, state) {
    const { debug } = (0, infrastructure_logger_1.getInfrastructureLogger)(compiler);
    // inspired by https://github.com/ypresto/fork-ts-checker-async-overlay-webpack-plugin
    compiler.hooks.done.intercept({
        register: (tap) => {
            if (['webpack-dev-server', 'rsbuild-dev-server'].includes(tap.name) && tap.type === 'sync' && config.devServer) {
                debug('Intercepting dev-server tap.');
                state.DevServerDoneTap = tap;
            }
            return tap;
        },
    });
}
exports.interceptDoneToGetDevServerTap = interceptDoneToGetDevServerTap;
