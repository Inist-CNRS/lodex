import composeAsync from '../../common/lib/composeAsync';

const pipeTo = (writeStream, options) => readStream =>
    readStream.pipe(writeStream, options);

const waitForStreamToComplete = stream =>
    new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
    });

export const append = (writeStream) => {
    const pipeToWriteStream = pipeTo(writeStream, { end: false });

    return async (readStream) => {
        pipeToWriteStream(readStream);
        return waitForStreamToComplete(readStream);
    };
};

export const concatStreams = (sourceStreams, resultStream) => {
    const appendToResult = append(resultStream);
    composeAsync(
        sourceStreams.map(appendToResult),
    );
};
