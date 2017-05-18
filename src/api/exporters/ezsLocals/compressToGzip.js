import zlib from 'zlib';

module.exports = zlib.createGzip({
    level: 9, //max compression
});
