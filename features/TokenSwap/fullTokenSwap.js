/**
 * Analyze full word hashing between each element in a CSV file.
 */

const fs = require('fs');
const path = require('path');

function fullCsvTokenSwap(csvString) {
    const rows = csvString.split('\r\n');
    const result = rows.map(row => row.split(','));
    // console.log(result);

    const tokenMap = new Map();
    result.forEach(row => {
        row.forEach(element => {
            tokenMap.set(element, (tokenMap.get(element) || 0) + 1);
        });
    });

    // console.log([...tokenMap.entries()].sort((a, b) => b[1] - a[1]));
    const totalKeyLength = [...tokenMap.keys()].reduce((sum, key) => sum + key.length, 0);
    console.log('Total sum of key lengths:', totalKeyLength);

    return tokenMap;
}

function scanCsvTiming(csvString) {
    const start = process.hrtime();
    for (let i = 0; i < csvString.length; i++) {
        // csvString[i] = csvString[i];
    }
    const end = process.hrtime(start);
    console.log(`scanCsvTiming: ${end[0]}s ${end[1] / 1000000}ms`);
}



const csvFilePath = path.join(__dirname, 'data/003.csv');
const csv = fs.readFileSync(csvFilePath, 'utf8');
console.log(csv.length);
scanCsvTiming(csv);


const tokenMap = fullCsvTokenSwap(csv);
