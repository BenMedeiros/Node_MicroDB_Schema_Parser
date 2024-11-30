// Import the importFile function
// const { promptUser } = require('./features/commandLineInterface');
// promptUser();



const { getFilesInFolder } = require('./features/getFilesInFolder');
const { importFile } = require('./features/importFile');
const { parseObjectForSchema } = require('./features/parseObjectForSchema');

const relativePath = './files/test_data/';
getFilesInFolder(relativePath).then(files => {
    console.log(files);

    files.forEach(file => {
        importFile(relativePath + file).then(result => {
            console.log('\n');
            console.log('File:', file);
            console.log('\n');
            console.log(result);
            console.log(JSON.stringify(result)); // Non-pretty JSON
            console.log('Is Object? ', typeof result === 'object');

            const schema = parseObjectForSchema(result);
            console.log('Schema:', JSON.stringify(schema, null, 2));
        });
    });
});

