import streamSaver from 'streamsaver';

export default (stream, filename) => {
    const fileStream = streamSaver.createWriteStream(String(filename));
    return stream.pipeTo(fileStream);
};
