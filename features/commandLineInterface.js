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
        if (answer === '0' || answer.toLowerCase() === 'quit') {
            console.log('Exiting application...');
            rl.close();
        } else if (answer === '1' || answer.toLowerCase() === 'ls') {
            promptUserToSelectFile().then();
        } else {
            // If not quitting, call promptUser again
            console.log('You typed:', answer);
            promptUser();
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
            rl.write('Invalid file selection');
            promptUserToSelectFile();

        } else {
            rl.write('You selected file: ' + files[Number(answer)] + '\n');

            importFile(`./files/${files[answer]}`).then(result => {
                rl.write(JSON.stringify(result, null, 2)); // Indent with 2 spaces
                rl.write('\n');
                promptUser();
            });
        }
    })
}

module.exports = { promptUser };
