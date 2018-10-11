export default (readable, transforms) =>
    transforms.reduce((readable, newReadable) => {
        readable.on('error', e => newReadable.emit('error', e));
        return readable.pipe(newReadable);
    }, readable);
