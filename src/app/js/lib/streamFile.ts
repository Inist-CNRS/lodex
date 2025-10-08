// @ts-expect-error TS7016
import streamSaver from 'streamsaver';

// @ts-expect-error TS7006
export default (stream, filename) => {
    const fileStream = streamSaver.createWriteStream(String(filename));
    return stream.pipeTo(fileStream);
};
