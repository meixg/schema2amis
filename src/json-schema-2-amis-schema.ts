import type {
    JSONSchema4
} from 'json-schema';
import {logger} from './utils';
import get from 'lodash/get';

class JsonSchema2AmisSchemaCompiler {
    definitions: Record<string, JSONSchema4>;
    constructor(schema: JSONSchema4) {
        this.definitions = schema.definitions || {};
    }

    makeControls(properties: JSONSchema4['properties'], parent: JSONSchema4) {
        if (!properties) {
            return [];
        }
    
        const keys = Object.keys(properties).filter(key => {
            return key !== 'xsd:annotation' && key !== 'xs:annotation'
        });
        return keys.map(key => this.property2control(properties[key], key, parent));
    }

    property2control(property: JSONSchema4, key: string, parent: JSONSchema4) {
        const requiredList = parent.required || [];
        let rest: any = {};
    
        if (property.$ref) {
            const ref = property.$ref;
            property = this.findDefinition(property.$ref);
    
            if (!property) {
                logger.error(`Definition for ${ref} not fount!`);
                return;
            }
        }
    
        if (Array.isArray(property.enum)) {
            rest = this.compileEnum(property);
        }
        else if (property.type === 'integer') {
            rest = this.compileInteger(property);
        }
        else if (property.type === 'number') {
            
        }
        else if (property.type === 'array') {
            rest = this.compileArray(property);
        }
        else if (property.type === 'string') {
            rest = this.compileString(property);
        }
        else if (property.type === 'boolean') {
            rest = this.compileBoolean(property);
        }
        else if (property.type === 'object' || property.properties) {
            rest = this.compileObject(property);
        }
    
        const validations = this.compileValidations(property);
    
        return {
            name: key,
            required: !!~requiredList.indexOf(key),
            label: property.title || property.description,
            desc: property.title && property.description,
            value: property.default,
            validations,
            ...rest
        };
    }

    compileValidations(property: JSONSchema4) {
        const validations: any = {};
        if (typeof property.minimum === 'number') {
            validations.minimum = property.minimum;
        }
        if (typeof property.maximum === 'number') {
            validations.maximum = property.maximum;
        }

        if (typeof property.minLength === 'number') {
            validations.minLength = property.minLength;
        }
        if (typeof property.maxLength === 'number') {
            validations.maxLength = property.maxLength;
        }

        if (typeof property.pattern === 'string') {
            validations.matchRegexp = property.pattern;
        }

        return validations;
    }

    compileInteger(property: JSONSchema4) {
        const res: any = {
            type: 'number'
        };

        typeof property.minimum === 'number' && (res.min = property.minimum);
        typeof property.maximum === 'number' && (res.max = property.maximum);

        return res;
    }

    compileString(property: JSONSchema4) {
        const res: any = {
            type: 'text'
        };

        return res;
    }

    compileEnum(property: JSONSchema4) {
        const res: any = {
            type: 'select'
        };
        res.options = property.enum;
        return res;
    }

    compileBoolean(property: JSONSchema4) {
        const res: any = {
            type: 'checkbox'
        };
        return res;
    }

    compileObject(property: JSONSchema4) {
        const res: any = {
            type: 'combo'
        };
        res.controls = this.makeControls(property.properties, property);
        res.multiLine = true;
        return res;
    }

    compileArray(property: JSONSchema4) {
        const res: any = {
            type: 'array'
        };

        const items = property.items;
        
        if (Array.isArray(items)) {
            logger.error('Array items is not support in array type.');
            return;
        }
        if (!items) {
            logger.error('Array item is not specified.');
            return;
        }

        res.multiLine = true;
        res.items = this.property2control(items, '', property);

        return res;
    }

    findDefinition(path: string) {
        return get(this.definitions, path.replace(/^#\/definitions\//, '').replace('\/', '.'));
    }
}

export function JsonSchema2AmisSchema(schema: JSONSchema4) {
    if (schema.type !== 'object') {
        throw new Error('JSONSchme2AMisSchema 只支持 object 转换');
    }

    const compiler = new JsonSchema2AmisSchemaCompiler(schema);

    return {
        title: schema.title,
        type: 'form',
        mode: 'horizontal',
        controls: compiler.makeControls(schema.properties, schema)
    };
}
