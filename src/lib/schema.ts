export class Schema {

    private schema: schemaInput;
    private options: schemaOptions;

    constructor(schema: schemaInput, options: schemaOptions = { database: 'redisgraph', jsonOutput: true }) {
        this.options = options;
        this.schema = schema;
    }

    validateSchema() {
        // check all keys are strings
        const rootKeys = Object.keys(this.schema);
        for (const k of rootKeys) {
            if (typeof k !== 'string') {
                throw new Error('All node names must be string types.');
            }
        }
        // check all values are Records
        const rootValues = Object.values(this.schema);
        for (const k of rootValues) {
            if (typeof k !== 'object') {
                throw new Error('All nodes must have valid fields.');
            }
            // check all keys are strings
            const secondKeys = Object.keys(k);
            for (const sk of secondKeys) {
                if (typeof sk !== 'string') {
                    throw new Error('All field names must be string types.');
                }
            }
             // check all values are types
            const secondValues = Object.values(k);
            sv: for (const sv of secondValues) {
                if (typeof sv === 'string') {
                    if (!(rootKeys.includes(sv))) {
                        throw new Error(sv + ' is not a valid node type.');
                    }
                    continue sv;
                }
                if (Array.isArray(sv) && !rootKeys.includes(sv[0])) {
                    throw new Error(sv + ' is not a valid node type.');
                }
                // other types (boolean, string, date, number) are not checked here
                // as TS should catch this by default
            }
        }
        return true;
    }
}



export type schemaTypes = typeof String | typeof Boolean | typeof Number | typeof Date | string | string[];


export interface validators {
    type: schemaTypes;
    required?: boolean;
    default?: string | number | boolean | Date;
    unique?: boolean;
};

export type schemaInput = Record<string, Record<string, schemaTypes | validators>>;

export interface schemaOptions {
    database?: 'redisgraph' | 'neo4j';
    jsonOutput?: boolean;
};