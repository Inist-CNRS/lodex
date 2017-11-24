import through from 'through';

export const chunkStream = chunkSize => {
    let acc = [];
    return through(
        function write(d) {
            acc.push(d);
            if (acc.length >= chunkSize) {
                this.queue(acc);
                acc = [];
            }
        },
        function end() {
            if (acc.length) {
                this.queue(acc);
            }
        },
    );
};

export default insertMany => stream =>
    new Promise((resolve, reject) => {
        stream.pipe(chunkStream(100)).pipe(through(chunk => insertMany(chunk)));

        stream.on('end', resolve);
        stream.on('error', reject);
    });
