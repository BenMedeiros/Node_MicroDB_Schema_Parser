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

    const sortedTokens = [...tokenMap.entries()].sort((a, b) => b[1] - a[1]);
    const totalKeyLength = sortedTokens.reduce((acc, [key, value]) => acc + key.length, 0);
    const totalKeyCount = sortedTokens.length;
    console.log('Total key length:', totalKeyLength);
    tokenMap.clear();


    const baseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    function toBaseChars(num) {
        if (num === 0) return baseChars[0];
        let result = '';
        while (num > 0) {
            result = baseChars[num % baseChars.length] + result;
            num = Math.floor(num / baseChars.length);
        }
        return result;
    }

    sortedTokens.forEach(([key, value], index) => {
        tokenMap.set(key, {
            hash: toBaseChars(index),
            count: value
        });
    });

    return { tokenMap, totalKeyCount };
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

function replaceCsvWithTokenMap(csvString, { tokenMap, totalKeyCount }) {
    const rows = csvString.split('\r\n');
    const result = rows.map(row => row.split(','));

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

    return result.map(row => row.join(',')).join('\r\n');
}

function convertCsvToDataSet(csvString) {
    const rows = csvString.split('\r\n');
    return rows.map(row => row.split(','));
}

const csvFilePath = path.join(__dirname, 'data/003.csv');
console.log('Reading CSV file:', csvFilePath);
const csv = fs.readFileSync(csvFilePath, 'utf8');
// console.log('CSV:', csv);
console.log(csv.length);
scanCsvTiming(csv);
scanCsvReplaceTiming(csv);

console.log();
const { tokenMap, totalKeyCount } = fullCsvTokenSwap(csv);

const replacedCsv = replaceCsvWithTokenMap(csv, { tokenMap, totalKeyCount });
// console.log('Replaced CSV:', replacedCsv);
console.log('Length of replaced CSV:', replacedCsv.length);
runWithTiming(scanCsvTiming, replacedCsv);
runWithTiming(scanCsvReplaceTiming, replacedCsv);
console.log();


// speed comparisions against DB structure instead of strings
console.log('Converting to dataset...');
const originalDataSet = convertCsvToDataSet(csv);
const replacedDataSet = convertCsvToDataSet(replacedCsv);
// console.log('Original dataset:', originalDataSet);
// console.log('Replaced dataset:', replacedDataSet);


/* 
Notes to Self
The real compression ratio is replaced CSV length + total key length since that needs to be stored.
If every hash uses the same length (ex 3 chars) then the comma can be assumed and not stored.
A hash would need to exist for newline, but if the columns are consistent, then is a stored 1x.
*/