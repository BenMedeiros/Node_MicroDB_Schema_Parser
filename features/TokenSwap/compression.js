const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const dataFolder = path.join(__dirname, 'data');

fs.readdir(dataFolder, async (err, files) => {
    const compressionInfo = [];

    if (err) {
        return console.error('Unable to read directory:', err);
    }

    for (const file of files) {
        const filePath = path.join(dataFolder, file);
        try {
            const data = fs.readFileSync(filePath);
            const fileCompressionInfo = {};
            compressionInfo.push(fileCompressionInfo);
            fileCompressionInfo.file = file;
            fileCompressionInfo.size = data.length;

            let startTime, endTime;

            startTime = process.hrtime();
            await new Promise((resolve, reject) => {
                zlib.gzip(data, (err, compressedData) => {
                    if (err) {
                        console.error('Unable to compress file:', err);
                        return reject(err);
                    }
                    fileCompressionInfo.gzip = {
                        size: compressedData.length,
                        time: process.hrtime(startTime)[0] * 1000 + process.hrtime(startTime)[1] / 1000000 // convert to milliseconds
                    };
                    resolve();
                });
            });

            startTime = process.hrtime();
            await new Promise((resolve, reject) => {
                zlib.deflate(data, (err, compressedData) => {
                    if (err) {
                        console.error('Unable to compress file:', err);
                        return reject(err);
                    }
                    fileCompressionInfo.deflate = {
                        size: compressedData.length,
                        time: process.hrtime(startTime)[0] * 1000 + process.hrtime(startTime)[1] / 1000000 // convert to milliseconds
                    };
                    resolve();
                });
            });

            startTime = process.hrtime();
            await new Promise((resolve, reject) => {
                zlib.brotliCompress(data, (err, compressedData) => {
                    if (err) {
                        console.error('Unable to compress file:', err);
                        return reject(err);
                    }
                    fileCompressionInfo.brotli = {
                        size: compressedData.length,
                        time: process.hrtime(startTime)[0] * 1000 + process.hrtime(startTime)[1] / 1000000 // convert to milliseconds
                    };
                    resolve();
                });
            });

        } catch (err) {
            console.error('Unable to read file:', err);
        }
    }

    console.dir(compressionInfo, { depth: null });
});