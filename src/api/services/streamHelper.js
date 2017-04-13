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

export const concatStreamsFactory = appendImpl => (sourceStreams, resultStream) => {
    const appendToResult = appendImpl(resultStream);
    return composeAsync(
        sourceStreams.map(appendToResult),
    )();
};

export const concatStreams = concatStreamsFactory(append);
