"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = normalize;
function normalize(schemaValue) {
    if (typeof schemaValue === 'object' && 'type' in schemaValue) {
        // Duration type support
        if (typeof schemaValue.type === 'object' && schemaValue.type.kind === 'duration') {
            const durationType = schemaValue.type;
            let def = undefined;
            // Always prefer schemaValue.default, but if not present, use durationType.default
            if ('default' in schemaValue && typeof schemaValue.default !== 'undefined') {
                def = schemaValue.default;
            }
            else if ('default' in durationType && typeof durationType.default !== 'undefined') {
                def = durationType.default;
            }
            return {
                type: durationType,
                optional: 'optional' in schemaValue ? schemaValue.optional : true,
                default: def,
            };
        }
        return {
            type: schemaValue.type,
            optional: 'optional' in schemaValue ? schemaValue.optional : true,
            default: 'default' in schemaValue ? schemaValue.default : undefined,
        };
    }
    return {
        type: schemaValue,
        optional: false,
    };
}
//# sourceMappingURL=normalize.js.map