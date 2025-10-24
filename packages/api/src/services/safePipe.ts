export default (stream: any, transforms: any) =>
    transforms.reduce((prevStream: any, nextStream: any) => {
        prevStream.on('error', (e: any) => nextStream.emit('error', e));
        return prevStream.pipe(nextStream);
    }, stream);
