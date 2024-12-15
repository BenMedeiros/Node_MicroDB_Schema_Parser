const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function readFolderAndTestCompression(dataFolder) {
    const compressionInfo = [];

    try {
        const files = fs.readdirSync(dataFolder);

        for (const file of files) {
            const filePath = path.join(dataFolder, file);
            try {
                let startTime = process.hrtime();

                const data = fs.readFileSync(filePath);
                const fileCompressionInfo = {};
                compressionInfo.push(fileCompressionInfo);
                fileCompressionInfo.file = file;
                fileCompressionInfo.size = data.length;
                fileCompressionInfo.time = process.hrtime(startTime)[0] * 1000 + process.hrtime(startTime)[1] / 1000000 // convert to milliseconds

                startTime = process.hrtime();
                const gzipData = zlib.gzipSync(data);
                fileCompressionInfo.gzip = {
                    size: gzipData.length,
                    time: process.hrtime(startTime)[0] * 1000 + process.hrtime(startTime)[1] / 1000000 // convert to milliseconds
                };

                startTime = process.hrtime();
                const deflateData = zlib.deflateSync(data);
                fileCompressionInfo.deflate = {
                    size: deflateData.length,
                    time: process.hrtime(startTime)[0] * 1000 + process.hrtime(startTime)[1] / 1000000 // convert to milliseconds
                };

                startTime = process.hrtime();
                const brotliData = zlib.brotliCompressSync(data);
                fileCompressionInfo.brotli = {
                    size: brotliData.length,
                    time: process.hrtime(startTime)[0] * 1000 + process.hrtime(startTime)[1] / 1000000 // convert to milliseconds
                };

            } catch (err) {
                console.error('Unable to read file:', err);
            }
        }

        // console.dir(compressionInfo, { depth: null });
    } catch (err) {
        console.error('Unable to read directory:', err);
    }

    return compressionInfo;
}

const dataFolder = path.join(__dirname, 'data');
// readFolderAndTestCompression(dataFolder);


const allComprssionTests = [];
for (let i = 0; i < 10; i++) {
    console.log('i:', i);
    const compressionInfo = readFolderAndTestCompression(dataFolder);
    allComprssionTests.push(compressionInfo);
    // console.dir(compressionInfo, { depth: null });
}

function getArrayStats(array){
    const stats = {
        min: Math.min(...array),
        max: Math.max(...array),
        median: array.sort((a, b) => a - b)[Math.floor(array.length / 2)],
        sum: array.reduce((a, b) => a + b, 0)
    };
    stats.avg = stats.sum / array.length;
    stats.stdDev = Math.sqrt(array.reduce((a, b) => a + Math.pow(b - stats.avg, 2), 0) / array.length);
    stats.stdDev = Math.round(stats.stdDev * 10000) / 10000; // round to 4 decimal places

    // if all values are the same, return that value
    if(stats.min === stats.max){
        return stats.min;
    }
    return stats;
}

const testResults = [];
for (const compressionInfo of allComprssionTests) {
    for (i = 0; i < compressionInfo.length; i++) {
        const fileCompressionInfo = compressionInfo[i];

        if (!testResults[i]) {
            testResults[i] = {
                file: fileCompressionInfo.file,
                size: fileCompressionInfo.size,
                gzip: { size: [], time: [] },
                deflate: { size: [], time: [] },
                brotli: { size: [], time: [] }
            };
        }

        testResults[i].gzip.size.push(fileCompressionInfo.gzip.size);
        testResults[i].gzip.time.push(fileCompressionInfo.gzip.time);
        testResults[i].deflate.size.push(fileCompressionInfo.deflate.size);
        testResults[i].deflate.time.push(fileCompressionInfo.deflate.time);
        testResults[i].brotli.size.push(fileCompressionInfo.brotli.size);
        testResults[i].brotli.time.push(fileCompressionInfo.brotli.time);
    }
}

testResults.forEach((testResult) => {
    testResult.gzip.size = getArrayStats(testResult.gzip.size);
    testResult.gzip.time = getArrayStats(testResult.gzip.time);
    testResult.deflate.size = getArrayStats(testResult.deflate.size);
    testResult.deflate.time = getArrayStats(testResult.deflate.time);
    testResult.brotli.size = getArrayStats(testResult.brotli.size);
    testResult.brotli.time = getArrayStats(testResult.brotli.time);
});

console.log('testResults:');
console.dir(testResults, { depth: null });

console.table(testResults.map(result => ({
    file: result.file,
    size: result.size,
    // gzipSize: result.gzip.size,
    // gzipTime: result.gzip.time,
    // gzipTimeMin: result.gzip.time.min,
    // gzipTimeMax: result.gzip.time.max,
    // gzipTimeMedian: result.gzip.time.median,
    // gzipTimeStdDev: result.gzip.time.stdDev,
    // deflateSize: result.deflate.size,
    // deflateTime: result.deflate.time,
    defTMin: result.deflate.time.min,
    defTMax: result.deflate.time.max,
    defTMedian: result.deflate.time.median,
    defTStdDev: result.deflate.time.stdDev,
    brotliSize: result.brotli.size,
    // brotliTime: result.brotli.time,
    brliTMin: result.brotli.time.min,
    brliMax: result.brotli.time.max,
    brliTMedian: result.brotli.time.median,
    brliTStdDev: result.brotli.time.stdDev
})));

