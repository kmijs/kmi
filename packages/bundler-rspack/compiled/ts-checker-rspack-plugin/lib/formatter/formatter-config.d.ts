import type { Formatter, FormatterPathType } from './formatter';
import type { FormatterOptions } from './formatter-options';
type FormatterConfig = {
    format: Formatter;
    pathType: FormatterPathType;
};
declare function createFormatterConfig(options: FormatterOptions | undefined): FormatterConfig;
export { FormatterConfig, createFormatterConfig };
