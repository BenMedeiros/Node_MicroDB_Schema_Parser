const fs = require('fs');
const path = require('path');

function tokenSwap(csv) {
    const csvArray = csv.split(',');
    console.log(csvArray);

    const substringMap = new Map();

    // Build usage map of all substring tokens
    csvArray.forEach(element => {
        for (let i = 0; i < element.length; i++) {
            for (let j = i + 1; j <= element.length; j++) {
                substringMap.set(element.substring(i, j), (substringMap.get(element.substring(i, j)) || 0) + 1);
            }
        }
    });

    // console.log(substringMap);

    const tokenValueCutoff = 0;
    // Remove all tokens with value less than tokenvaluecutoff
    substringMap.forEach((value, key) => {
        // remove short tokens that aren't valuable to replace
        if (key.length < 2) {
            substringMap.delete(key);
        } else if (value * key.length < tokenValueCutoff) {
            substringMap.delete(key);
        }
    });

    console.log(substringMap);

    // get largest token value*key.length
    let largestTokenKey = '';
    let largestTokenValue = 0;
    substringMap.forEach((value, key) => {
        if (value * key.length > largestTokenValue * largestTokenKey.length) {
            largestTokenKey = key;
            largestTokenValue = value;
        }
    });

    console.log('Largest token:', largestTokenKey, largestTokenValue, largestTokenKey.length*largestTokenValue);

    // replace all instances of largest token with 'a'
    csvArray.forEach((element, index) => {
        csvArray[index] = element.replaceAll(largestTokenKey, 'a');
    });
    console.log(csvArray);

    // remove all tokens that are substrings of the largest token so that map value list is updated 
    // based on the parent string being replaced.
    substringMap.forEach((value, key) => {
        if (largestTokenKey.includes(key)) {
            substringMap.set(key, value - largestTokenValue);
        }
    });

    console.log(substringMap);

}


const csvFilePath = path.join(__dirname, '001.csv');
// const csvFilePath = path.join(__dirname, '002.csv');
const csv = fs.readFileSync(csvFilePath, 'utf8');
// tokenSwap(csv.replaceAll('3.10444330774908', '001').replaceAll('1.55222165387454', '002'));

tokenSwap(csv);

