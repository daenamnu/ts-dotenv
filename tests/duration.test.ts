import { parseDurationToMilliseconds } from "../lib/duration";

const d = (n: number) => n * 24 * 60 * 60 * 1000;
const h = (n: number) => n * 60 * 60 * 1000;
const min = (n: number) => n * 60 * 1000;
const s = (n: number) => n * 1000;

describe("parseDurationToMilliseconds", () => {
    it("parses 1a2mon3min", () => {
        // 1 year (365d) + 2 months (2*30d) + 3 minutes
        const expected = 365 * d(1) + 2 * (30 * d(1)) + min(3);
        expect(parseDurationToMilliseconds("1a2mon3min", 0)).toBe(expected);
    });

    it("parses 14d-2h", () => {
        expect(parseDurationToMilliseconds("14d-2h", 0)).toBe(d(14) - h(2));
    });

    it("parses 2h30m", () => {
        expect(parseDurationToMilliseconds("2h30m", 0)).toBe(h(2) + min(30));
    });

    it("parses decimal hours 1.5h", () => {
        expect(parseDurationToMilliseconds("1.5h", 0)).toBe(h(1.5));
    });

    it("parses milliseconds 500ms", () => {
        expect(parseDurationToMilliseconds("500ms", 0)).toBe(500);
    });

    it("handles mixed units and signs", () => {
        const expected = 3 * min(1) + 2 * (7 * d(1)) - d(1);
        expect(parseDurationToMilliseconds("3m+2w-1d", 0)).toBe(expected);
    });

    it("falls back to seconds for plain numeric strings", () => {
        expect(parseDurationToMilliseconds("10", 0)).toBe(s(10));
    });
});


