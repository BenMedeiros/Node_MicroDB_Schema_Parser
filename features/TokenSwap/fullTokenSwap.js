/**
 * Analyze full word hashing between each element in a CSV file.
 */

const { hash } = require('crypto');
const fs = require('fs');
const path = require('path');

function runWithTiming(func, ...args) {
    const start = process.hrtime();
    const result = func(...args);
    const end = process.hrtime(start);
    console.log(`${func.name}: ${end[0]}s ${end[1] / 1000000}ms`);
    return result;
}

function fullCsvTokenSwap(csvString, encodingCharSet) {
    const rows = csvString.split(rowEol);
    const result = rows.map(row => row.split(colEol));
    // console.log(result);
    console.log('Rows:', result.length);

    const tokenMap = new Map();
    result.forEach(row => {
        row.forEach(element => {
            tokenMap.set(element, (tokenMap.get(element) || 0) + 1);
        });
    });

    const sortedTokens = [...tokenMap.entries()].sort((a, b) => b[1] - a[1]);
    const totalKeyLength = sortedTokens.reduce((acc, [key, value]) => acc + key.length, 0);
    const totalKeyCount = sortedTokens.length;
    console.log('Total key length:', totalKeyLength);
    console.log('Chars Needed:', Math.log(totalKeyCount) / Math.log(encodingCharSet.length));
    tokenMap.clear();

    function toEncodingCharSet(num) {
        if (num === 0) return encodingCharSet[0];
        let result = '';
        while (num > 0) {
            result = encodingCharSet[num % encodingCharSet.length] + result;
            num = Math.floor(num / encodingCharSet.length);
        }
        return result;
    }

    sortedTokens.forEach(([key, value], index) => {
        tokenMap.set(key, {
            hash: toEncodingCharSet(index),
            count: value
        });
    });

    return { tokenMap, totalKeyCount };
}

function scanCsvTiming(csvString) {
    for (let i = 0; i < csvString.length; i++) {
        csvString[i];
    }
}

function scanCsvReplaceTiming(csvString) {
    const csvStringCopy = csvString.slice();
    for (let i = 0; i < csvStringCopy.length; i++) {
        // wanted some status updates for large files
        if (i % 1000000 === 0) {
            console.log('i:', i / 1000000);
        }

        csvStringCopy[i] = csvStringCopy[i];
    }
}

function replaceCsvWithTokenMap(csvString, { tokenMap, totalKeyCount }) {
    const rows = csvString.split(rowEol);
    const result = rows.map(row => row.split(colEol));

    const start = process.hrtime();
    let index = 0;

    // console.log('Token Map:', tokenMap);
    console.log('Total count of keys:', totalKeyCount);
    result.forEach(row => {
        row.forEach((element, idx) => {
            if (tokenMap.has(element)) {
                const replacement = tokenMap.get(element).hash;
                index++;
                row[idx] = replacement;
            }
        });
    });

    const end = process.hrtime(start);
    console.log(`replaceCsvWithTokenMap: ${end[0]}s ${end[1] / 1000000}ms`);

    return result.map(row => row.join(colEol)).join(rowEol);
}

function convertCsvToDataSet(csvString) {
    const rows = csvString.split(rowEol);
    return rows.map(row => row.split(colEol));
}

const csvFilePath = path.join(__dirname, 'data/003.csv');
const rowEol = ',';
const colEol = ';';
const fileLimitSize = 10000000;

const encodingCharSets = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    Array(256).fill(0).map((_, i) => String.fromCharCode(i)).join(''),
]

console.log('Reading CSV file:', csvFilePath);
const csv = fs.readFileSync(csvFilePath, 'utf8').slice(0, fileLimitSize);
// console.log('CSV:', csv);
console.log('Length of CSV:', csv.length);
console.log();
runWithTiming(scanCsvTiming, csv);
runWithTiming(scanCsvReplaceTiming, csv);

for (const encodingCharSet of encodingCharSets) {
    console.log();
    console.log('Encoding Char Set:', encodingCharSet);
    const { tokenMap, totalKeyCount } = fullCsvTokenSwap(csv, encodingCharSet);
    console.log();
    const replacedCsv = replaceCsvWithTokenMap(csv, { tokenMap, totalKeyCount });
    // console.log('Replaced CSV:', replacedCsv);
    console.log('Length of replaced CSV:', replacedCsv.length);
    console.log();
    runWithTiming(scanCsvTiming, replacedCsv);
    runWithTiming(scanCsvReplaceTiming, replacedCsv);
}

console.log();

// speed comparisions against DB structure instead of strings
// console.log('Converting to dataset...');
// const originalDataSet = convertCsvToDataSet(csv);
// const replacedDataSet = convertCsvToDataSet(replacedCsv);
// console.log('Original dataset:', originalDataSet);
// console.log('Replaced dataset:', replacedDataSet);

// const outputFilePath = path.join(__dirname, 'tests/output.csv');
// fs.writeFileSync(outputFilePath, replacedCsv, 'utf8');
// console.log('Replaced CSV saved to:', outputFilePath);



/* 
Notes to Self
The real compression ratio is replaced CSV length + total key length since that needs to be stored.
If every hash uses the same length (ex 3 chars) then the comma can be assumed and not stored.
A hash would need to exist for newline, but if the columns are consistent, then is a stored 1x.
*/