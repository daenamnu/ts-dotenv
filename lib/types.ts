type DefaultValueKeyConfig = DefaultBooleanKeyConfig | DefaultBufferKeyConfig | DefaultNumberKeyConfig | DefaultStringKeyConfig;
interface DefaultBooleanKeyConfig {
    type: BooleanConstructor;
    default: boolean;
}

interface DefaultBufferKeyConfig {
    type: typeof Buffer;
    default: Buffer;
}

interface DefaultNumberKeyConfig {
    type: NumberConstructor;
    default: number;
}
export type Env = {
    [key: string]: string | undefined;
};


export type EnvSchemaValue = DefaultValueKeyConfig | OptionalKeyConfig | EnvSchemaType;

export type EnvSchema = {
    [key: string]: EnvSchemaValue;
};


export interface EnvKeyConfig {
    type: EnvSchemaType;
    optional: boolean;
    default?: boolean | Buffer | number | string;
}


// Duration type for schema
export type DurationSchemaType = {
    kind: 'duration';
    unit: 'seconds' | 'milliseconds';
    default?: number | string;
};


// For type inference
type IsDuration<T> = T extends DurationSchemaType ? true : false;

/**
 * Resolves to the type of the provided environment schema.
 *
 * @typeParam S - pass `typeof schema` here
 */
export type EnvType<S extends EnvSchema> = { [K in keyof S]: S[K] extends { type: infer T } ? (T extends DurationSchemaType ? number : T extends BooleanConstructor ? boolean : T extends typeof Buffer ? Buffer : T extends NumberConstructor ? number : T extends StringConstructor ? string : T extends RegExp ? string : T extends Array<infer U> ? U : never) : (S[K] extends DurationSchemaType ? number : S[K] extends BooleanConstructor ? boolean : S[K] extends typeof Buffer ? Buffer : S[K] extends NumberConstructor ? number : S[K] extends StringConstructor ? string : S[K] extends RegExp ? string : S[K] extends Array<infer U> ? U : never); };

/**
 * Resolves to the type of the provided environment schema.
 *
 * @typeParam S - pass `typeof schema` here
 */

export type EnvSchemaType =
    | BooleanConstructor
    | typeof Buffer
    | NumberConstructor
    | StringConstructor
    | RegExp
    | Array<string>
    | DurationSchemaType;

interface OptionalKeyConfig<T extends EnvSchemaType = EnvSchemaType> {
    type: T;
    optional: boolean;
}

interface DefaultStringKeyConfig {
    type: StringConstructor | RegExp | Array<string>;
    default: string;
}

// Removed stray mapped type block and duplicate EnvType definition.

type EnvSchemaDefaultValueType<C extends DefaultValueKeyConfig> = C extends DefaultBooleanKeyConfig
    ? boolean
    : C extends DefaultBufferKeyConfig
    ? Buffer
    : C extends DefaultNumberKeyConfig
    ? number
    : C extends DefaultStringKeyConfig
    ? string
    : never;

type EnvSchemaValueType<T extends EnvSchemaType> = T extends BooleanConstructor
    ? boolean
    : T extends typeof Buffer
    ? Buffer
    : T extends NumberConstructor
    ? number
    : T extends StringConstructor
    ? string
    : T extends RegExp
    ? string
    : T extends Array<infer U>
    ? U
    : never;
