/**
 * Analyze full word hashing between each element in a CSV file.
 */

const fs = require('fs');
const path = require('path');

function fullCsvTokenSwap(csvString) {
    const rows = csvString.split('\r\n');
    const result = rows.map(row => row.split(','));
    console.log(result);

    const tokenMap = new Map();
    result.forEach(row => {
        row.forEach(element => {
            tokenMap.set(element, (tokenMap.get(element) || 0) + 1);
        });
    });

    console.log([...tokenMap.entries()].sort((a, b) => b[1] - a[1]));
}


const csvFilePath = path.join(__dirname, 'data/003.csv');
const csv = fs.readFileSync(csvFilePath, 'utf8');

fullCsvTokenSwap(csv);