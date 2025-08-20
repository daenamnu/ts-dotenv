"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coerce = coerce;
const normalize_1 = require("./normalize");
const duration_1 = require("./duration");
function coerce(schema, env) {
    const coerced = {};
    for (const [key, schemaValue] of Object.entries(schema)) {
        const value = env[key];
        const config = (0, normalize_1.normalize)(schemaValue);
        if (config.default !== undefined && (value === '' || value === undefined)) {
            coerced[key] = config.default;
            continue;
        }
        if (config.optional && value === undefined) {
            coerced[key] = undefined;
            continue;
        }
        if (config.type === Boolean) {
            coerced[key] = value === 'true';
            continue;
        }
        if (config.type === Buffer) {
            coerced[key] = Buffer.from(value, 'base64');
            continue;
        }
        if (config.type === Number) {
            coerced[key] = parseInt(value, 10);
            continue;
        }
        if (typeof config.type === 'object' && config.type.kind === 'duration') {
            const durationType = config.type;
            let num;
            if (value === undefined || value === '') {
                if (typeof durationType.default === 'number') {
                    num = durationType.default;
                }
                else if (typeof durationType.default === 'string') {
                    if (durationType.unit === 'milliseconds') {
                        num = (0, duration_1.parseDurationToMilliseconds)(durationType.default, 0, { throwOnUnknownUnit: true });
                    }
                    else {
                        num = (0, duration_1.parseDurationToSeconds)(durationType.default, 0, { throwOnUnknownUnit: true });
                    }
                }
                else {
                    throw new Error(`Missing required duration value for key '${key}' and no default provided.`);
                }
            }
            else {
                try {
                    if (/^-?\d{1,15}$/.test(value)) {
                        num = parseInt(value, 10);
                    }
                    else {
                        if (durationType.unit === 'milliseconds') {
                            num = (0, duration_1.parseDurationToMilliseconds)(value, 0, { throwOnUnknownUnit: true });
                        }
                        else {
                            num = (0, duration_1.parseDurationToSeconds)(value, 0, { throwOnUnknownUnit: true });
                        }
                    }
                }
                catch (_a) {
                    throw new Error(`Invalid duration value for key '${key}': '${value}'`);
                }
            }
            coerced[key] = num;
            continue;
        }
        coerced[key] = value;
    }
    return coerced;
}
//# sourceMappingURL=coerce.js.map