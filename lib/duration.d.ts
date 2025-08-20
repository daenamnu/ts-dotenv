export interface ParseDurationOptions {
    millisecondsPerMonth?: number;
    millisecondsPerYear?: number;
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
export declare function parseDurationToSeconds(input: string, fallback: number, options?: ParseDurationOptions): number;
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
export declare function parseDurationToMilliseconds(input: string, fallback: number, options?: ParseDurationOptions): number;
