/**
 * Parses an object and returns a schema representation.
 *
 * @param {Object} obj - The object to parse.
 * @returns {Object} - The schema representation of the object.
 */
function parseObjectForSchema(obj) {
    const schema = [];

    if (typeof obj !== 'object') {
        return {
            type: typeof obj,
            value: obj
        };
    }else if(typeof obj === 'object' && obj === null){
        const properties = parseObjectForSchema(obj[key]);
        schema.push({
            key: key,
            type: 'object',
            propertiesKey: properties.map(prop => {
                if (prop.type === 'array') {
                    return prop.key + ':' + prop.type + '+' + prop.pattern;
                } else {
                    return prop.key + ':' + prop.type;
                }
            }).join(';'),   
            properties
        });
    }

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (Array.isArray(obj[key])) {
                const items = obj[key].map(item => parseObjectForSchema(item));
                schema.push({
                    key,
                    type: 'array',
                    pattern: detectArraySchema(items),
                    items
                });

            } else if (typeof obj[key] === 'object') {
                
            } else {
                schema.push({
                    key: key,
                    type: typeof obj[key],
                    value: obj[key]
                });
            }
        }
    }

    return schema;
}

// check if the array has multiple types of classes
function detectArraySchema(array) {
    const schemaPatterns = [];
    console.log('Detecting array schema:', array);

    for (const item of array) {
        if (schemaPatterns.length === 0) {
            console.log(schemaPatterns, item.type);
            schemaPatterns.push(item.type);
            console.log('1st pattern found:', item);
        } else if (!schemaPatterns.includes(item.type)) {
            schemaPatterns.push(item.type);
            console.log('2nd pattern found:', item);
        }
    }

    return schemaPatterns.sort();
}


// Export the parseObjectForSchema function
module.exports = { parseObjectForSchema };