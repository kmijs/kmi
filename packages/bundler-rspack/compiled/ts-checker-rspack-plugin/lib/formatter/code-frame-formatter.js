"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCodeFrameFormatter = void 0;
const os_1 = __importDefault(require("os"));
const code_frame_1 = require("@kmijs/bundler-compiled/compiled/babel/code-frame");
const node_fs_1 = __importDefault(require("node:fs"));
const basic_formatter_1 = require("./basic-formatter");
function createCodeFrameFormatter(options) {
    const basicFormatter = (0, basic_formatter_1.createBasicFormatter)();
    return function codeFrameFormatter(issue) {
        const source = issue.file && node_fs_1.default.existsSync(issue.file) && node_fs_1.default.readFileSync(issue.file, 'utf-8');
        let frame = '';
        if (source && issue.location) {
            frame = (0, code_frame_1.codeFrameColumns)(source, issue.location, {
                highlightCode: true,
                ...(options || {}),
            })
                .split('\n')
                .map((line) => '  ' + line)
                .join(os_1.default.EOL);
        }
        const lines = [basicFormatter(issue)];
        if (frame) {
            lines.push(frame);
        }
        return lines.join(os_1.default.EOL);
    };
}
exports.createCodeFrameFormatter = createCodeFrameFormatter;
