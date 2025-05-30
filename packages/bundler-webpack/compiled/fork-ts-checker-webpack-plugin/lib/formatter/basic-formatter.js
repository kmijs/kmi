"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBasicFormatter = void 0;
const chalk_1 = __importDefault(require("@kmijs/shared/compiled/chalk"));
function createBasicFormatter() {
    return function basicFormatter(issue) {
        return chalk_1.default.grey(issue.code + ': ') + issue.message;
    };
}
exports.createBasicFormatter = createBasicFormatter;
