import {getJsonSchema} from 'jgexml/xsd2json';
import {xml2json} from 'jgexml/xml2json';

// import path from 'path';
// import fs from 'fs';
// const xsdPath = path.resolve(__dirname, '../../sample/realtime.xsd')
// const XML_SCHEMA = fs.readFileSync(xsdPath, 'utf-8');
// compileXsd2JsonSchema(XML_SCHEMA);



export function compileXsd2JsonSchema(xml: string) {
    const xmlJson = xml2json(xml, {
        "attributePrefix": "@",
        "valueProperty": false,
        "coerceTypes": false
    });
    
    const jsonSchema = getJsonSchema(xmlJson, 'example.xsd','', false, 'xsd:');
    return jsonSchema;
}
