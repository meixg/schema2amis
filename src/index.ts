import { compileXsd2JsonSchema } from "./xsd-2-json-schema";
import {JsonSchema2AmisSchema} from './json-schema-2-amis-schema';

export function xmlSchema2Amis(xsd: string) {
    const jsonSchema = compileXsd2JsonSchema(xsd);
    return jsonSchema2Amis(jsonSchema);
}

export function jsonSchema2Amis(jsonSchema: Object) {
    return JsonSchema2AmisSchema(jsonSchema);
}