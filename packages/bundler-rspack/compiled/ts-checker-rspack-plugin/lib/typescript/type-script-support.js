"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertTypeScriptSupport = void 0;
const os_1 = __importDefault(require("os"));
const node_fs_1 = __importDefault(require("node:fs"));
function assertTypeScriptSupport(config) {
    let typescriptVersion;
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        typescriptVersion = require(config.typescriptPath).version;
    }
    catch (error) {
        // silent catch
    }
    if (!typescriptVersion) {
        throw new Error('When you use TsCheckerRspackPlugin with typescript reporter enabled, you must install `typescript` package.');
    }
    if (!node_fs_1.default.existsSync(config.configFile)) {
        throw new Error([
            `Cannot find the "${config.configFile}" file.`,
            `Please check webpack and TsCheckerRspackPlugin configuration.`,
            `Possible errors:`,
            '  - wrong `context` directory in webpack configuration (if `configFile` is not set or is a relative path in the fork plugin configuration)',
            '  - wrong `typescript.configFile` path in the plugin configuration (should be a relative or absolute path)',
        ].join(os_1.default.EOL));
    }
}
exports.assertTypeScriptSupport = assertTypeScriptSupport;
