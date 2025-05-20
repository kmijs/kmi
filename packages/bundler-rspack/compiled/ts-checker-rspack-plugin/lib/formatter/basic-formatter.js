"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBasicFormatter = void 0;
const picocolors_1 = __importDefault(require("@kmijs/shared/compiled/picocolors"));
function createBasicFormatter() {
    return function basicFormatter(issue) {
        return picocolors_1.default.gray(issue.code + ': ') + issue.message;
    };
}
exports.createBasicFormatter = createBasicFormatter;
