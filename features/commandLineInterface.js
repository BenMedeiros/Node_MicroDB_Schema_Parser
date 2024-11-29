const readline = require('readline');
const { getFilesInFolder } = require('./getFilesInFolder');
const { importFile } = require('./importFile');

// Setup readline to read from standard input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to prompt user for input
function promptUser() {
    const menu = '\n0 : quit: exit application\n'
        + '1 : ls: list files for import\n';

    rl.question(menu, (answer) => {
        switch (answer.toLowerCase()) {
            case '0':
            case 'quit':
                console.log('Exiting application...');
                rl.close();
                break;
            case '1':
            case 'ls':
                promptUserToSelectFile();
                break;
            default:
                console.log('You typed:', answer);
                promptUser();
                break;
        }
    });
}

async function promptUserToSelectFile() {
    const files = await getFilesInFolder('./files');
    const result = files.map((file, index) => `${index}: ${file}`).join('\n');

    rl.question('\nChoose file to open:\n' + result + '\n', (answer) => {
        if (answer.toLowerCase() === 'quit') {
            console.log('Exiting application...');
            rl.close();
            
        } else if (files[answer] === undefined) {
            console.log('Invalid file selection');
            promptUserToSelectFile();

        } else {
            console.log('You selected file: ' + files[Number(answer)]);

            importFile(`./files/${files[answer]}`).then(result => {
                console.log(JSON.stringify(result, null, 2)); // Indent with 2 spaces
                promptUser();
            });
        }
    });
}

module.exports = { promptUser };
