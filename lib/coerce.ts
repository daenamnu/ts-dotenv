
import { normalize } from './normalize';
import { EnvSchema, EnvType } from './types';
import { ValidatedEnv } from './validate';
import { DurationSchemaType } from './types';
import { parseDurationToMilliseconds, parseDurationToSeconds } from './duration';

type CoercedEnv = {
    [key: string]: boolean | Buffer | number | string | undefined;
};

export function coerce<S extends EnvSchema>(
    schema: S,
    env: ValidatedEnv,
): EnvType<S> {
    const coerced: CoercedEnv = {};

    for (const [key, schemaValue] of Object.entries(schema)) {
        const value = env[key];
        const config = normalize(schemaValue);

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

        if (typeof config.type === 'object' && (config.type as DurationSchemaType).kind === 'duration') {
            const durationType = config.type as DurationSchemaType;
            let num: number;
            if (value === undefined || value === '') {
                if (typeof durationType.default === 'number') {
                    num = durationType.default;
                } else if (typeof durationType.default === 'string') {
                    if (durationType.unit === 'milliseconds') {
                        num = parseDurationToMilliseconds(durationType.default, 0, { throwOnUnknownUnit: true });
                    } else {
                        num = parseDurationToSeconds(durationType.default, 0, { throwOnUnknownUnit: true });
                    }
                } else {
                    throw new Error(`Missing required duration value for key '${key}' and no default provided.`);
                }
            } else {
                try {
                    if (/^-?\d{1,15}$/.test(value)) {
                        num = parseInt(value, 10);
                    } else {
                        if (durationType.unit === 'milliseconds') {
                            num = parseDurationToMilliseconds(value, 0, { throwOnUnknownUnit: true });
                        } else {
                            num = parseDurationToSeconds(value, 0, { throwOnUnknownUnit: true });
                        }
                    }
                } catch {
                    throw new Error(`Invalid duration value for key '${key}': '${value}'`);
                }
            }
            coerced[key] = num;
            continue;
        }

        coerced[key] = value;
    }

    return coerced as EnvType<S>;
}
