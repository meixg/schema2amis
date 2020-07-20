import { compileXsd2JsonSchema } from "./xsd-2-json-schema";
import {JsonSchema2AmisSchema} from './json-schema-2-amis-schema';
import fs from 'fs';
import path from 'path';

export function xmlSchema2Amis(xsd: string) {
    const jsonSchema = compileXsd2JsonSchema(xsd);
    // fs.writeFileSync(path.resolve(__dirname, '../sample/realtime.json'), JSON.stringify(jsonSchema));
    
    
    const amisJson = jsonSchema2Amis(jsonSchema);
    
    // fs.writeFileSync(path.resolve(__dirname, '../sample/realtime_amis.json'), JSON.stringify(amisJson));

    return amisJson;
}

export function jsonSchema2Amis(jsonSchema: Object) {
    return JsonSchema2AmisSchema(jsonSchema);
}


// xmlSchema2Amis(fs.readFileSync(path.resolve(__dirname, '../sample/realtime.xsd'), 'utf-8'));