"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const load_1 = require("../lib/load");
describe('load (duration integration)', () => {
    afterEach(() => {
        process.env = {};
    });
    it('should parse duration in seconds', () => {
        process.env.DURATION = '2h30m';
        const schema = {
            DURATION: { type: { kind: "duration", unit: "seconds" }, optional: false },
        };
        const env = (0, load_1.load)(schema);
        expect(env.DURATION).toBe(2 * 3600 + 30 * 60);
    });
    it('should parse duration in milliseconds', () => {
        process.env.DURATION = '1.5h';
        const schema = {
            DURATION: { type: { kind: "duration", unit: "milliseconds" }, optional: false },
        };
        const env = (0, load_1.load)(schema);
        expect(env.DURATION).toBe(1.5 * 60 * 60 * 1000);
    });
    it('should use default if not set', () => {
        delete process.env.DURATION;
        const schema = {
            DURATION: { type: { kind: "duration", unit: "seconds", default: 42 }, optional: false },
        };
        const env = (0, load_1.load)(schema);
        expect(env.DURATION).toBe(42);
    });
    it('should throw for invalid duration', () => {
        process.env.DURATION = 'notaduration';
        const schema = {
            DURATION: { type: { kind: "duration", unit: "seconds" }, optional: false },
        };
        // Defensive: clear after test
        try {
            expect(() => (0, load_1.load)(schema)).toThrow();
        }
        finally {
            delete process.env.DURATION;
        }
    });
});
//# sourceMappingURL=load.duration.test.js.map