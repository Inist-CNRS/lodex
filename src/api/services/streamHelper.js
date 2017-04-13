export const append = writeStream => readStream =>
    new Promise((resolve, reject) => {
        readStream.pipe(writeStream, { end: false });
        readStream.on('end', resolve);
        readStream.on('error', reject);
    });

export const concatStreams = (sourceStreams, resultStream) => {
    const nbSources = sourceStreams.length;
    const appendToResult = append(resultStream);
    const loop = async (index) => {
        if (index >= nbSources) {
            resultStream.end();

            return null;
        }
        await appendToResult(sourceStreams[index]);

        return loop(index + 1);
    };

    return loop(0);
};
