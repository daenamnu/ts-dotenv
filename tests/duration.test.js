"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const duration_1 = require("../lib/duration");
const d = (n) => n * 24 * 60 * 60 * 1000;
const h = (n) => n * 60 * 60 * 1000;
const min = (n) => n * 60 * 1000;
const s = (n) => n * 1000;
describe("parseDurationToMilliseconds", () => {
    it("parses 1a2mon3min", () => {
        // 1 year (365d) + 2 months (2*30d) + 3 minutes
        const expected = 365 * d(1) + 2 * (30 * d(1)) + min(3);
        expect((0, duration_1.parseDurationToMilliseconds)("1a2mon3min", 0)).toBe(expected);
    });
    it("parses 14d-2h", () => {
        expect((0, duration_1.parseDurationToMilliseconds)("14d-2h", 0)).toBe(d(14) - h(2));
    });
    it("parses 2h30m", () => {
        expect((0, duration_1.parseDurationToMilliseconds)("2h30m", 0)).toBe(h(2) + min(30));
    });
    it("parses decimal hours 1.5h", () => {
        expect((0, duration_1.parseDurationToMilliseconds)("1.5h", 0)).toBe(h(1.5));
    });
    it("parses milliseconds 500ms", () => {
        expect((0, duration_1.parseDurationToMilliseconds)("500ms", 0)).toBe(500);
    });
    it("handles mixed units and signs", () => {
        const expected = 3 * min(1) + 2 * (7 * d(1)) - d(1);
        expect((0, duration_1.parseDurationToMilliseconds)("3m+2w-1d", 0)).toBe(expected);
    });
    it("falls back to seconds for plain numeric strings", () => {
        expect((0, duration_1.parseDurationToMilliseconds)("10", 0)).toBe(s(10));
    });
});
//# sourceMappingURL=duration.test.js.map