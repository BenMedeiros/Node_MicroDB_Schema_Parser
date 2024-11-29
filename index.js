// Import the importFile function
const { promptUser } = require('./features/commandLineInterface');
const { importFile } = require('./features/importFile');

// Example usage of importFile function
// (async () => {
//     try {
//         // Call the importFile function with the path to your file
//         const data = await importFile('./files/peopleXml.xml'); // Change the path and filename accordingly
//         console.log(data);
//     } catch (error) {
//         console.error(error.message);
//     }
// })();

promptUser();
