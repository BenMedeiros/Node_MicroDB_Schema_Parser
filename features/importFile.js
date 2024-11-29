const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const csv = require('csv-parser');

/**
 * Imports a file at the given path and returns its content based on the file type.
 *
 * @param {string} filePath - The path to the file to import.
 * @returns {Promise<Object|string>} - A promise that resolves with the parsed content of the file.
 * @throws {Error} - Throws an error if the file cannot be read or parsed.
 */
function importFile(filePath) {
    // Resolve the full path
    const fullPath = path.resolve(filePath);
    const fileExt = path.extname(fullPath).toLowerCase();

    return new Promise((resolve, reject) => {
        try {
            // Read the file content
            const fileContent = fs.readFileSync(fullPath, 'utf-8');

            switch (fileExt) {
                case '.json':
                    resolve(JSON.parse(fileContent));
                    break;
                
                case '.xml':
                    xml2js.parseString(fileContent, (err, result) => {
                        if (err) {
                            reject(new Error(`Failed to parse XML: ${err.message}`));
                        } else {
                            resolve(result);
                        }
                    });
                    break;
                
                case '.csv':
                    const csvData = [];
                    fs.createReadStream(fullPath)
                        .pipe(csv())
                        .on('data', (row) => csvData.push(row))
                        .on('end', () => resolve(csvData))
                        .on('error', (err) => reject(new Error(`Failed to parse CSV: ${err.message}`)));
                    break;

                case '.tsv':
                    const tsvData = [];
                    const tsvLines = fileContent.split('\n');
                    const headers = tsvLines[0].split('\t');

                    for (let i = 1; i < tsvLines.length; i++) {
                        if (tsvLines[i]) {
                            const values = tsvLines[i].split('\t');
                            const row = {};
                            headers.forEach((header, index) => {
                                row[header] = values[index];
                            });
                            tsvData.push(row);
                        }
                    }
                    resolve(tsvData);
                    break;

                default:
                    resolve(fileContent); // Return as plain string for unsupported formats
            }
        } catch (error) {
            reject(new Error(`Failed to import file: ${error.message}`));
        }
    });
}

// Export the importFile function
module.exports = { importFile };