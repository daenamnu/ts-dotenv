const MILLISECONDS_IN_SECOND = 1_000;
const MILLISECONDS_IN_MINUTE = 60 * MILLISECONDS_IN_SECOND;
const MILLISECONDS_IN_HOUR = 60 * MILLISECONDS_IN_MINUTE;
const MILLISECONDS_IN_DAY = 24 * MILLISECONDS_IN_HOUR;
const MILLISECONDS_IN_WEEK = 7 * MILLISECONDS_IN_DAY;

export interface ParseDurationOptions {
    // Used for converting months/years. Defaults: 30d per month, 365d per year
    millisecondsPerMonth?: number;
    millisecondsPerYear?: number;
    // If true, throws on unknown unit; otherwise ignores unknown fragments
    throwOnUnknownUnit?: boolean;
    roundResult?: boolean;
}

/**
 * Parse a duration expression into seconds.
 *
 * Supported examples:
 * - "1a2mon3m" => 1 year + 2 months + 3 minutes
 * - "14d-2h"   => 14 days - 2 hours
 * - "2h30min"  => 2 hours + 30 minutes
 * - "1.5h"     => 1.5 hours
 * - "500ms"    => 500 milliseconds
 * - Whitespace and '+' are optional between segments. '-' negates the following segment.
 *
 * Units:
 * - Years:  "y", "yr", "year", "years", "a"
 * - Months: "mo", "mon", "month", "months"
 * - Weeks:  "w", "week", "weeks"
 * - Days:   "d", "day", "days"
 * - Hours:  "h", "hr", "hour", "hours"
 * - Minutes: "m", "min", "minute", "minutes"
 * - Seconds: "s", "sec", "second", "seconds"
 * - Milliseconds: "ms", "millisecond", "milliseconds"
 */
export function parseDurationToSeconds(
    input: string,
    fallback: number,
    options: ParseDurationOptions = {}
): number {
    const milliseconds = parseDurationToMilliseconds(input, fallback * MILLISECONDS_IN_SECOND, options);

    const seconds = milliseconds / MILLISECONDS_IN_SECOND;

    if (options.roundResult) return Math.floor(seconds);

    return seconds;
}

/**
 * Parse a duration expression into milliseconds.
 *
 * Supported examples:
 * - "1a2mon3m" => 1 year + 2 months + 3 minutes
 * - "14d-2h"   => 14 days - 2 hours
 * - "2h30min"  => 2 hours + 30 minutes
 * - "1.5h"     => 1.5 hours
 * - "500ms"    => 500 milliseconds
 * - Whitespace and '+' are optional between segments. '-' negates the following segment.
 *
 * Units:
 * - Years:  "y", "yr", "year", "years", "a"
 * - Months: "mo", "mon", "month", "months"
 * - Weeks:  "w", "week", "weeks"
 * - Days:   "d", "day", "days"
 * - Hours:  "h", "hr", "hour", "hours"
 * - Minutes: "m", "min", "minute", "minutes"
 * - Seconds: "s", "sec", "second", "seconds"
 * - Milliseconds: "ms", "millisecond", "milliseconds"
 */
export function parseDurationToMilliseconds(
    input: string,
    fallback: number,
    options: ParseDurationOptions = {}
): number {
    if (typeof input !== "string") {
        if (fallback) return fallback;
        throw new Error("Duration must be a string");
    }

    const source = input.trim().toLowerCase();
    if (source.length === 0) {
        if (fallback) return fallback;
        return 0;
    }

    const millisecondsPerMonth =
        options.millisecondsPerMonth ?? 30 * MILLISECONDS_IN_DAY;
    const millisecondsPerYear = options.millisecondsPerYear ?? 365 * MILLISECONDS_IN_DAY;

    // Regex captures optional sign, number, and unit tokens.
    // Special handling to ensure 'min' is minutes and lone 'm' is treated as months.
    const tokenRegex = /([+\-])?\s*(\d+(?:\.\d+)?)\s*(a|y|yr|year|years|mo|mon|month|months|w|week|weeks|d|day|days|h|hr|hour|hours|min|minute|minutes|s|sec|second|seconds|ms|millisecond|milliseconds|m(?!in)\b)/g;

    let match: RegExpExecArray | null;
    let total = 0;

    while ((match = tokenRegex.exec(source)) !== null) {
        const [, signRaw, valueRaw, unitRaw] = match;
        if (valueRaw == null || unitRaw == null) continue;
        const value = parseFloat(valueRaw);
        const sign = signRaw === "-" ? -1 : 1;
        const unit = unitRaw.toLowerCase();

        const millis = unitToMilliseconds(unit, value, {
            millisecondsPerMonth,
            millisecondsPerYear,
        });

        if (millis == null) {
            if (options.throwOnUnknownUnit) {
                throw new Error(`Unknown time unit in segment: '${match[0]}'`);
            }
            continue;
        }

        total += sign * millis;
    }

    // If nothing matched, attempt to fail fast
    if (total === 0) {
        // If the input was a plain number, assume seconds for backwards friendliness
        const numeric = Number(source);
        if (!Number.isNaN(numeric) && source === String(numeric)) {
            return numeric * MILLISECONDS_IN_SECOND;
        }
        if (options.throwOnUnknownUnit) {
            throw new Error(`Could not parse duration: '${input}'`);
        }
    }

    return total;
}

function unitToMilliseconds(
    unit: string,
    value: number,
    ctx: { millisecondsPerMonth: number; millisecondsPerYear: number }
): number | null {
    switch (unit) {
        // years
        case "y":
        case "yr":
        case "year":
        case "years":
        case "a":
            return value * ctx.millisecondsPerYear;
        // months
        case "mo":
        case "mon":
        case "month":
        case "months":
            return value * ctx.millisecondsPerMonth;
        // weeks
        case "w":
        case "week":
        case "weeks":
            return value * MILLISECONDS_IN_WEEK;
        // days
        case "d":
        case "day":
        case "days":
            return value * MILLISECONDS_IN_DAY;
        // hours
        case "h":
        case "hr":
        case "hour":
        case "hours":
            return value * MILLISECONDS_IN_HOUR;
        // minutes (require 'min')
        case "m":
        case "min":
        case "minute":
        case "minutes":
            return value * MILLISECONDS_IN_MINUTE;
        // seconds
        case "s":
        case "sec":
        case "second":
        case "seconds":
            return value * MILLISECONDS_IN_SECOND;
        // milliseconds
        case "ms":
        case "millisecond":
        case "milliseconds":
            return value;
        default:
            return null;
    }
}