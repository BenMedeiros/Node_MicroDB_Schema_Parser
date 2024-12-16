/**
 * Analyze full word hashing between each element in a CSV file.
 */

const fs = require('fs');
const path = require('path');

function runWithTiming(func, ...args) {
    const start = process.hrtime();
    const result = func(...args);
    const end = process.hrtime(start);
    console.log(`${func.name}: ${end[0]}s ${end[1] / 1000000}ms`);
    return result;
}

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
        csvString[i];
    }
    const end = process.hrtime(start);
    console.log(`scanCsvTimingxx: ${end[0]}s ${end[1] / 1000000}ms`);
}

function scanCsvReplaceTiming(csvString) {
    const csvStringCopy = csvString.slice();
    const start = process.hrtime();
    for (let i = 0; i < csvStringCopy.length; i++) {
        csvStringCopy[i] = csvStringCopy[i];
    }
    const end = process.hrtime(start);
    console.log(`scanCsvReplaceTimingxx: ${end[0]}s ${end[1] / 1000000}ms`);
}

function replaceCsvWithTokenMap(csvString, tokenMap) {
    const rows = csvString.split('\r\n');
    const result = rows.map(row => row.split(','));

    const start = process.hrtime();
    let index = 0;

    result.forEach(row => {
        row.forEach((element, idx) => {
            if (tokenMap.has(element)) {
                const replacement = Buffer.from(String.fromCharCode(65 + index % 58)) + Buffer.from(String.fromCharCode(65 + index / 58));
                index++;
                row[idx] = replacement;
            }
        });
    });

    const end = process.hrtime(start);
    console.log(`replaceCsvWithTokenMap: ${end[0]}s ${end[1] / 1000000}ms`);

    return result.map(row => row.join(',')).join('\r\n');
}

const csvFilePath = path.join(__dirname, 'data/003.csv');
const csv = fs.readFileSync(csvFilePath, 'utf8');
// console.log('CSV:', csv);
console.log(csv.length);
scanCsvTiming(csv);
scanCsvReplaceTiming(csv);


const tokenMap = fullCsvTokenSwap(csv);

const replacedCsv = replaceCsvWithTokenMap(csv, tokenMap);
// console.log('Replaced CSV:', replacedCsv);
console.log('Length of replaced CSV:', replacedCsv.length);
runWithTiming(scanCsvTiming, replacedCsv);
scanCsvTiming(replacedCsv);
runWithTiming(scanCsvReplaceTiming, replacedCsv);
scanCsvReplaceTiming(replacedCsv);
console.log();


