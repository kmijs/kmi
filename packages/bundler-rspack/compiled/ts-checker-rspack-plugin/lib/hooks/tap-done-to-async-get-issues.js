"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tapDoneToAsyncGetIssues = void 0;
const picocolors_1 = __importDefault(require("@kmijs/shared/compiled/picocolors"));
;
const stats_formatter_1 = require("../formatter/stats-formatter");
const webpack_formatter_1 = require("../formatter/webpack-formatter");
const infrastructure_logger_1 = require("../infrastructure-logger");
const issue_webpack_error_1 = require("../issue/issue-webpack-error");
const plugin_hooks_1 = require("../plugin-hooks");
const is_pending_1 = require("../utils/async/is-pending");
const wait_1 = require("../utils/async/wait");
function tapDoneToAsyncGetIssues(compiler, config, state) {
    const hooks = (0, plugin_hooks_1.getPluginHooks)(compiler);
    const { debug } = (0, infrastructure_logger_1.getInfrastructureLogger)(compiler);
    compiler.hooks.done.tap('TsCheckerRspackPlugin', async (stats) => {
        if (stats.compilation.compiler !== compiler) {
            // run only for the compiler that the plugin was registered for
            return;
        }
        const issuesPromise = state.issuesPromise;
        let issues;
        try {
            if (await (0, is_pending_1.isPending)(issuesPromise)) {
                hooks.waiting.call(stats.compilation);
                config.logger.log(picocolors_1.default.cyan('Type-checking in progress...'));
            }
            else {
                // wait 10ms to log issues after webpack stats
                await (0, wait_1.wait)(10);
            }
            issues = await issuesPromise;
        }
        catch (error) {
            hooks.error.call(error, stats.compilation);
            return;
        }
        if (!issues || // some error has been thrown
            state.issuesPromise !== issuesPromise // we have a new request - don't show results for the old one
        ) {
            return;
        }
        debug(`Got ${issues?.length || 0} issues from getIssuesWorker.`);
        // filter list of issues by provided issue predicate
        issues = issues.filter(config.issue.predicate);
        // modify list of issues in the plugin hooks
        issues = hooks.issues.call(issues, stats.compilation);
        const formatter = (0, webpack_formatter_1.createWebpackFormatter)(config.formatter.format, config.formatter.pathType);
        if (issues.length) {
            // follow webpack's approach - one process.write to stderr with all errors and warnings
            config.logger.error(issues.map((issue) => formatter(issue)).join('\n'));
            // print stats of the compilation
            config.logger.log((0, stats_formatter_1.statsFormatter)(issues, stats));
        }
        else {
            config.logger.log(picocolors_1.default.green('No errors found.'));
        }
        // report issues to dev-server (overlay), if it's listening
        // skip reporting if there are no issues, to avoid an extra hot reload
        if (issues.length && state.DevServerDoneTap) {
            issues.forEach((issue) => {
                const error = new issue_webpack_error_1.IssueWebpackError(config.formatter.format(issue), config.formatter.pathType, issue);
                if (issue.severity === 'warning') {
                    stats.compilation.warnings.push(error);
                }
                else {
                    stats.compilation.errors.push(error);
                }
            });
            debug('Sending issues to the dev-server.');
            state.DevServerDoneTap.fn(stats);
        }
    });
}
exports.tapDoneToAsyncGetIssues = tapDoneToAsyncGetIssues;
