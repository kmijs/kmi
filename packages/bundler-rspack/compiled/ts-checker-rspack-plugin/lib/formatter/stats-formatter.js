"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsFormatter = void 0;
const picocolors_1 = __importDefault(require("@kmijs/shared/compiled/picocolors"));
// mimics webpack's stats summary formatter
function statsFormatter(issues, stats) {
    const errorsNumber = issues.filter((issue) => issue.severity === 'error').length;
    const warningsNumber = issues.filter((issue) => issue.severity === 'warning').length;
    const errorsFormatted = errorsNumber
        ? picocolors_1.default.bold(picocolors_1.default.red(`${errorsNumber} ${errorsNumber === 1 ? 'error' : 'errors'}`))
        : '';
    const warningsFormatted = warningsNumber
        ? picocolors_1.default.bold(picocolors_1.default.yellow(`${warningsNumber} ${warningsNumber === 1 ? 'warning' : 'warnings'}`))
        : '';
    const timeFormatted = stats.startTime ? Math.round(Date.now() - stats.startTime) : 0;
    return [
        'Found ',
        errorsFormatted,
        errorsFormatted && warningsFormatted ? ' and ' : '',
        warningsFormatted,
        timeFormatted ? ` in ${timeFormatted} ms` : '',
        '.',
    ].join('');
}
exports.statsFormatter = statsFormatter;
