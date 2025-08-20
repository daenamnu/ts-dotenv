"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EnvError_1 = require("../lib/EnvError");
const validate_1 = require("../lib/validate");
describe('validate', () => {
    describe('boolean', () => {
        const schema = {
            KEY: Boolean,
        };
        it('should allow true', () => {
            const env = { KEY: 'true' };
            expect(() => (0, validate_1.validate)(schema, env)).not.toThrow();
        });
        it('should allow false', () => {
            const env = { KEY: 'false' };
            expect(() => (0, validate_1.validate)(schema, env)).not.toThrow();
        });
        it('should reject a boolean with leading whitespace', () => {
            const env = { KEY: ' false' };
            expect(() => (0, validate_1.validate)(schema, env)).toThrow(EnvError_1.EnvError);
        });
        it('should reject a boolean with trailing whitespace', () => {
            const env = { KEY: 'false ' };
            expect(() => (0, validate_1.validate)(schema, env)).toThrow(EnvError_1.EnvError);
        });
        it('should reject any other string', () => {
            const env = { KEY: 'string' };
            expect(() => (0, validate_1.validate)(schema, env)).toThrow(EnvError_1.EnvError);
        });
    });
    describe('buffer', () => {
        const schema = {
            KEY: Buffer,
        };
        it('should allow a full word', () => {
            const env = { KEY: 'YWJj' };
            expect(() => (0, validate_1.validate)(schema, env)).not.toThrow();
        });
        it('should allow a word padded with =', () => {
            const env = { KEY: 'YWI=' };
            expect(() => (0, validate_1.validate)(schema, env)).not.toThrow();
        });
        it('should allow a word padded with ==', () => {
            const env = { KEY: 'YQ==' };
            expect(() => (0, validate_1.validate)(schema, env)).not.toThrow();
        });
        it('should reject an improperly padded value', () => {
            const env = { KEY: 'YW=' };
            expect(() => (0, validate_1.validate)(schema, env)).toThrow();
        });
    });
    describe('number', () => {
        const schema = {
            KEY: Number,
        };
        it('should allow positive integers', () => {
            const env = { KEY: '123' };
            expect(() => (0, validate_1.validate)(schema, env)).not.toThrow();
        });
        it('should allow negative integers', () => {
            const env = { KEY: '-123' };
            expect(() => (0, validate_1.validate)(schema, env)).not.toThrow();
        });
        it('should allow a large number', () => {
            const env = { KEY: '123456789012345' };
            expect(() => (0, validate_1.validate)(schema, env)).not.toThrow();
        });
        it('should reject a number larger than the max safe integer', () => {
            const env = { KEY: '9007199254740992' };
            expect(() => (0, validate_1.validate)(schema, env)).toThrow(EnvError_1.EnvError);
        });
    });
    describe('regular expression', () => {
        const schema = {
            KEY: /abc/,
        };
        it('should allow a value that matches a provided regex', () => {
            const env = { KEY: 'abc' };
            expect(() => (0, validate_1.validate)(schema, env)).not.toThrow();
        });
        it('should reject a value that does not match a provided regex', () => {
            const env = { KEY: 'xyz' };
            expect(() => (0, validate_1.validate)(schema, env)).toThrow(EnvError_1.EnvError);
        });
    });
    describe('string', () => {
        const schema = {
            KEY: String,
        };
        it('should allow strings', () => {
            const env = { KEY: 'abc 123' };
            expect(() => (0, validate_1.validate)(schema, env)).not.toThrow();
        });
        it('should reject empty strings', () => {
            const env = { KEY: '' };
            expect(() => (0, validate_1.validate)(schema, env)).toThrow(EnvError_1.EnvError);
        });
    });
    describe('string union', () => {
        const schema = {
            KEY: ['value'],
        };
        it('should allow specified strings', () => {
            const env = { KEY: 'value' };
            expect(() => (0, validate_1.validate)(schema, env)).not.toThrow();
        });
        it('should reject other strings', () => {
            const env = { KEY: 'another-value' };
            expect(() => (0, validate_1.validate)(schema, env)).toThrow(EnvError_1.EnvError);
        });
    });
    describe('missing & extra keys', () => {
        const schema = {
            KEY: Boolean,
        };
        it('should reject an env missing a required key', () => {
            const env = {};
            expect(() => (0, validate_1.validate)(schema, env)).toThrow(EnvError_1.EnvError);
        });
        it('should reject an env with an undefined key', () => {
            const env = { KEY: undefined };
            expect(() => (0, validate_1.validate)(schema, env)).toThrow(EnvError_1.EnvError);
        });
        it('should allow an env with extra keys', () => {
            const env = { KEY: 'true', NODE_ENV: 'production' };
            expect(() => (0, validate_1.validate)(schema, env)).not.toThrow();
        });
    });
    describe('optional keys', () => {
        it('should allow missing values for an optional key', () => {
            const schema = {
                KEY: {
                    type: Boolean,
                    optional: true,
                },
            };
            expect(() => (0, validate_1.validate)(schema, {})).not.toThrow();
        });
        it('should allow missing values for a key with a default', () => {
            const schema = {
                KEY: {
                    type: Boolean,
                    default: true,
                },
            };
            expect(() => (0, validate_1.validate)(schema, {})).not.toThrow();
        });
    });
    describe('reporting', () => {
        it('should throw a custom error type', () => {
            const schema = {
                MISSING: Boolean,
            };
            try {
                (0, validate_1.validate)(schema, {});
            }
            catch (error) {
                expect(error).toBeInstanceOf(EnvError_1.EnvError);
                expect(error.name).toEqual('EnvError');
            }
        });
        it('should report missing variables', () => {
            const schema = {
                MISSING: Boolean,
            };
            expect(() => (0, validate_1.validate)(schema, {})).toThrowErrorMatchingSnapshot();
        });
        it('should report badly typed variables', () => {
            const schema = {
                BOOLEAN: Boolean,
                NUMBER: Number,
                REGEXP: /abc/,
                STRING_UNION: ['abc', 'def'],
            };
            const env = {
                BOOLEAN: '123',
                NUMBER: 'abc',
                REGEXP: 'true',
                STRING_UNION: 'xyz',
            };
            expect(() => (0, validate_1.validate)(schema, env)).toThrowErrorMatchingSnapshot();
        });
    });
});
//# sourceMappingURL=validate.test.js.map