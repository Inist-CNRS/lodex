export default (stream, transforms) =>
    transforms.reduce((prevStream, nextStream) => {
        prevStream.on('error', e => nextStream.emit('error', e));
        return prevStream.pipe(nextStream);
    }, stream);
