"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_1 = require("../lib/normalize");
describe('normalize', () => {
    it('should normalize boolean', () => {
        const schemaValue = Boolean;
        expect((0, normalize_1.normalize)(schemaValue)).toEqual({
            type: schemaValue,
            optional: false,
        });
    });
    it('should normalize number', () => {
        const schemaValue = Number;
        expect((0, normalize_1.normalize)(schemaValue)).toEqual({
            type: schemaValue,
            optional: false,
        });
    });
    it('should normalize string', () => {
        const schemaValue = String;
        expect((0, normalize_1.normalize)(schemaValue)).toEqual({
            type: schemaValue,
            optional: false,
        });
    });
    it('should normalize a regular expression', () => {
        const schemaValue = /abc/;
        expect((0, normalize_1.normalize)(schemaValue)).toEqual({
            type: schemaValue,
            optional: false,
        });
    });
    it('should normalize a string union', () => {
        const schemaValue = ['abc'];
        expect((0, normalize_1.normalize)(schemaValue)).toEqual({
            type: schemaValue,
            optional: false,
        });
    });
    it('should not change config for an optional field', () => {
        const schemaValue = {
            type: String,
            optional: true,
        };
        expect((0, normalize_1.normalize)(schemaValue)).toEqual({
            type: String,
            optional: true,
        });
    });
    it('should normalize config with a default value', () => {
        const schemaValue = {
            type: String,
            default: 'abc',
        };
        expect((0, normalize_1.normalize)(schemaValue)).toEqual({
            type: String,
            optional: true,
            default: 'abc',
        });
    });
});
//# sourceMappingURL=normalize.test.js.map