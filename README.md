# Node MicroDB Schema Parser

Node MicroDB Schema Parser is a lightweight library for parsing and validating database schemas in Node.js applications.

## Features

- Lightweight and fast
- Easy to use
- Supports various database schema formats
- Schema validation

## Installation

```bash
npm install node-microdb-schema-parser
```

## Usage

```javascript
const SchemaParser = require('node-microdb-schema-parser');

const schema = {
    users: {
        id: 'number',
        name: 'string',
        email: 'string'
    }
};

const parser = new SchemaParser(schema);

parser.validate({
    users: [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
    ]
});
```

## API

### `SchemaParser(schema)`

Creates a new instance of the schema parser.

- `schema` (Object): The database schema to be parsed and validated.

### `validate(data)`

Validates the provided data against the schema.

- `data` (Object): The data to be validated.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
## Examples

### Using `parseObjectForSchema`

```javascript
const { parseObjectForSchema } = require('./parseObjectForSchema');

const obj = {
    id: