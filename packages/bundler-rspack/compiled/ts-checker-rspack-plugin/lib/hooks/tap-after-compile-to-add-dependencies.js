"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tapAfterCompileToAddDependencies = void 0;
const infrastructure_logger_1 = require("../infrastructure-logger");
function tapAfterCompileToAddDependencies(compiler, config, state) {
    const { debug } = (0, infrastructure_logger_1.getInfrastructureLogger)(compiler);
    compiler.hooks.afterCompile.tapPromise('TsCheckerRspackPlugin', async (compilation) => {
        if (compilation.compiler !== compiler) {
            // run only for the compiler that the plugin was registered for
            return;
        }
        const dependencies = await state.dependenciesPromise;
        debug(`Got dependencies from the getDependenciesWorker.`, dependencies);
        if (dependencies) {
            state.lastDependencies = dependencies;
            dependencies.files.forEach((file) => {
                compilation.fileDependencies.add(file);
            });
        }
    });
}
exports.tapAfterCompileToAddDependencies = tapAfterCompileToAddDependencies;
