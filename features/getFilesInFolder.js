const fs = require('fs');
const path = require('path');

/**
 * Gets a list of files in the specified folder.
 *
 * @param {string} folder - The path to the folder.
 * @returns {Promise<string[]>} - A promise that resolves with an array of file names.
 * @throws {Error} - Throws an error if the folder cannot be read.
 */
function getFilesInFolder(folder) {
    return new Promise((resolve, reject) => {
        // Resolve the full path
        const folderPath = path.resolve(folder);
        
        fs.readdir(folderPath, (error, files) => {
            if (error) {
                reject(new Error(`Unable to scan directory: ${error.message}`));
            } else {
                // Filter out only the actual files
                // const filePaths = files.map(file => path.join(folderPath, file));
                resolve(files);
            }
        });
    });
}

// Export the getFilesInFolder function
module.exports = { getFilesInFolder };