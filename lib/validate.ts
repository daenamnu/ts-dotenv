import { EnvErrorReport, EnvErrorType, EnvError } from './EnvError';
import { normalize } from './normalize';
import { Env, EnvKeyConfig, EnvSchema } from './types';

/**
 * Only allows exactly 'true' or 'false'
 */
const booleanRegExp = /^(true|false)$/;

/**
 * Matches base-64 encoded binary data; checks for proper padding
 */
const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

/**
 * Only allows integers; crudely prevents values greater than MAX_SAFE_INTEGER.
 */
const numberRegExp = /^-?\d{1,15}$/;

export type ValidatedEnv = {
    [key: string]: string;
};

export function validate(schema: EnvSchema, env: Env): asserts env is ValidatedEnv {
    const report = validateSchema(schema, env);
    if (report) throw new EnvError(report);
}

function validateSchema(schema: EnvSchema, env: Env): EnvErrorReport | null {
    const report: EnvErrorReport = {};

    for (const [key, schemaValue] of Object.entries(schema)) {
        const value = env[key];
        const config = normalize(schemaValue);

        if (!valueExists(value)) {
            // If a default is present, always treat as optional
            if (config.default === undefined && !config.optional) {
                report[key] = {
                    type: EnvErrorType.MISSING,
                    config,
                };
            }
        } else if (!typeMatches(config, value)) {
            report[key] = {
                type: EnvErrorType.WRONG_TYPE,
                config,
                receivedValue: value,
            };
        }
    }

    return Object.values(report).some(value => value != null) ? report : null;
}

function valueExists(value: string | undefined): value is string {
    return !(value === undefined || value === '');
}

import { DurationSchemaType } from './types';
import { parseDurationToMilliseconds, parseDurationToSeconds } from './duration';

function typeMatches(config: EnvKeyConfig, value: string): boolean {
    if (config.type === Boolean) return booleanRegExp.test(value);
    if (config.type === Buffer) return base64RegExp.test(value);
    if (config.type === Number) return numberRegExp.test(value);
    if (typeof config.type === 'object' && (config.type as DurationSchemaType).kind === 'duration') {
        // Accept numbers or parseable duration strings
        if (numberRegExp.test(value)) return true;
        try {
            const unit = (config.type as DurationSchemaType).unit;
            if (unit === 'milliseconds') {
                parseDurationToMilliseconds(value, 0);
            } else {
                parseDurationToSeconds(value, 0);
            }
            return true;
        } catch {
            return false;
        }
    }
    if (config.type instanceof Array) return config.type.includes(value);
    if (config.type instanceof RegExp) return config.type.test(value);
    return true;
}
