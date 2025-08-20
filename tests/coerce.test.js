"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const coerce_1 = require("../lib/coerce");
describe('coerce', () => {
    describe('boolean', () => {
        const schema = {
            KEY: Boolean,
        };
        it('should coerce true', () => {
            const env = {
                KEY: 'true',
            };
            expect((0, coerce_1.coerce)(schema, env)).toEqual({ KEY: true });
        });
        it('should coerce false', () => {
            const env = {
                KEY: 'false',
            };
            expect((0, coerce_1.coerce)(schema, env)).toEqual({ KEY: false });
        });
        it('should use a default value', () => {
            const schema = {
                KEY: {
                    type: Boolean,
                    default: true,
                },
            };
            expect((0, coerce_1.coerce)(schema, {})).toEqual({ KEY: true });
        });
        it('should allow undefined', () => {
            const schema = {
                KEY: {
                    type: Boolean,
                    optional: true,
                },
            };
            expect((0, coerce_1.coerce)(schema, {})).toEqual({ KEY: undefined });
        });
    });
    describe('buffer', () => {
        it('should coerce base64-encoded data', () => {
            const schema = {
                KEY: Buffer,
            };
            const env = {
                KEY: '8J+Sjg==',
            };
            expect((0, coerce_1.coerce)(schema, env).KEY.toString()).toEqual('💎');
        });
        it('should use a default value', () => {
            const schema = {
                KEY: {
                    type: Buffer,
                    default: Buffer.from('🎉'),
                },
            };
            expect((0, coerce_1.coerce)(schema, {}).KEY.toString()).toEqual('🎉');
        });
        it('should allow undefined', () => {
            const schema = {
                KEY: {
                    type: Buffer,
                    optional: true,
                },
            };
            expect((0, coerce_1.coerce)(schema, {})).toEqual({ KEY: undefined });
        });
    });
    describe('number', () => {
        const schema = {
            KEY: Number,
        };
        it('should coerce a positive number', () => {
            const env = {
                KEY: '1234',
            };
            expect((0, coerce_1.coerce)(schema, env)).toEqual({ KEY: 1234 });
        });
        it('should coerce zero', () => {
            const env = {
                KEY: '0',
            };
            expect((0, coerce_1.coerce)(schema, env)).toEqual({ KEY: 0 });
        });
        it('should coerce a negative number', () => {
            const env = {
                KEY: '-1234',
            };
            expect((0, coerce_1.coerce)(schema, env)).toEqual({ KEY: -1234 });
        });
        it('should use a default value', () => {
            const schema = {
                KEY: {
                    type: Number,
                    default: 10,
                },
            };
            expect((0, coerce_1.coerce)(schema, {})).toEqual({ KEY: 10 });
        });
        it('should allow undefined', () => {
            const schema = {
                KEY: {
                    type: Number,
                    optional: true,
                },
            };
            expect((0, coerce_1.coerce)(schema, {})).toEqual({ KEY: undefined });
        });
    });
    describe('regular expression', () => {
        it('should remain a string', () => {
            const schema = {
                KEY: /abc/,
            };
            const env = {
                KEY: 'abc',
            };
            expect((0, coerce_1.coerce)(schema, env)).toEqual({ KEY: 'abc' });
        });
        it('should use a default value', () => {
            const schema = {
                KEY: { type: /abc/, default: 'abc' },
            };
            expect((0, coerce_1.coerce)(schema, {})).toEqual({ KEY: 'abc' });
        });
        it('should allow undefined', () => {
            const schema = {
                KEY: {
                    type: /abc/,
                    optional: true,
                },
            };
            expect((0, coerce_1.coerce)(schema, {})).toEqual({ KEY: undefined });
        });
    });
    describe('string', () => {
        it('should remain a string', () => {
            const schema = {
                KEY: String,
            };
            const env = {
                KEY: 'abc',
            };
            expect((0, coerce_1.coerce)(schema, env)).toEqual({ KEY: 'abc' });
        });
        it('should use a default value', () => {
            const schema = {
                KEY: {
                    type: String,
                    default: 'xyz',
                },
            };
            expect((0, coerce_1.coerce)(schema, {})).toEqual({ KEY: 'xyz' });
        });
        it('should allow undefined', () => {
            const schema = {
                KEY: {
                    type: String,
                    optional: true,
                },
            };
            expect((0, coerce_1.coerce)(schema, {})).toEqual({ KEY: undefined });
        });
    });
    describe('string union', () => {
        it('should remain a string', () => {
            const schema = {
                KEY: ['abc'],
            };
            const env = {
                KEY: 'abc',
            };
            expect((0, coerce_1.coerce)(schema, env)).toEqual({ KEY: 'abc' });
        });
        it('should use a default value', () => {
            const schema = {
                KEY: {
                    type: ['abc', 'def'],
                    default: 'def',
                },
            };
            expect((0, coerce_1.coerce)(schema, {})).toEqual({ KEY: 'def' });
        });
        it('should allow undefined', () => {
            const schema = {
                KEY: {
                    type: ['abc', 'def'],
                    optional: true,
                },
            };
            expect((0, coerce_1.coerce)(schema, {})).toEqual({ KEY: undefined });
        });
    });
});
//# sourceMappingURL=coerce.test.js.map