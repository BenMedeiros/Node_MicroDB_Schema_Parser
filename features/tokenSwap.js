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


// const csv = '3.10444330774908,13.9699948848709,3966.72954027363,7.76110826937269,1.55222165387454,1321.24975921962,4,83.3079497491461,0,4.00812936975231,79.2998203793938,0,87.4210367002453,2694.1574037621,2.21003580590404,0,3.10444330774908,967.59192893226,0,0,211.598645649457,0,93.7311405069054,0,0,93.7311405069054,0,0,482.802543594536,19.284473998524,12.4177732309963,7.76110826937269,12671.0832171776,1.55222165387454,0,5500.5713660143,2,70.479237632171,0,0,70.479237632171,0,0,6467.16987407496,2.21003580590404,1.55222165387454,1.55222165387454,933.815619298075,0,0,85.4341949570579,1,91.4741655181882,0,0,91.4741655181882,0,0,590.091997726656,6.86670076752767,3.10444330774908,4.65666496162362,6387.69620434747,3.10444330774908,0,2363.3482535214,1,85.7496316640104,0,0,85.7496316640104,0,0,3656.7822283364,9.97114407527674,6.20888661549816,4.65666496162362,2207.38117668119,1.55222165387454,0,187.756544731209,0,88.2438357925326,0,0,88.2438357925326,0,0,1761.33520533562,9.97114407527674,7.76110826937269,3.10444330774908,2843.17053450116,1.55222165387454,0,511.611748870754,0,88.2174902448457,0,0,88.2174902448457,0,0,2076.24962163083,2.21003580590404,1.55222165387454,1.55222165387454,820.565639936393,0,0,86.4276158286516,1,91.5159091046815,0,0,91.5159091046815,0,0,522.539378458284,5.31447911365313,3.10444330774908,3.10444330774908,6172.12387521164,1.55222165387454,0,2165.65750007426,1,86.0093022035984,0,0,86.0093022035984,0,0,3629.95986480337,3.76225745977858,1.55222165387454,3.10444330774908,4455.49260909773,0,0,1525.89445876792,0,91.5477085383715,0,0,91.5477085383715,0,0,2676.27582807342,6.86670076752767,3.10444330774908,4.65666496162362,2840.19027188638,1.55222165387454,0,737.118286722523,0,86.7976917247065,0,0,86.7976917247065,0,0,1797.098356713,9.97114407527674,3.10444330774908,7.76110826937269,1522.91419615314,0,0,86.4276158286516,0,91.6309175532377,0,0,91.6309175532377,0,0,1236.80898513415,7.90151851485021,3.88055413468635,4.91536194779032,45788.7548134966,1.55222165387454,0.129353460192642,14783.0959901858,10,87.3920858252907,0,0.334018231476631,87.058067593814,0,87.4210367002453,27591.2712876433,1332.17738880715,5211750400,19167170560,26161426432,0,74.5065653695272,0,1257.67082343762,0,0,0,0,828874752,688271360,0,0,0,4294751969,511664128,1908125696,714772480,8192,11816960,80998400,58503168,511664128,73.2650056651945,5089600,4970,0,972275712,99237888,1564049408,2590076928,85348352,3310';
// tokenSwap(csv.replaceAll('3.10444330774908', '001').replaceAll('1.55222165387454', '002'));

const csv = '123,1234,123123,1234,12341234';
tokenSwap(csv);

