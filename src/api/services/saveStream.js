import through from 'through';

import safePipe from './safePipe';
import progress from './progress';

export const chunkStream = chunkSize => {
    let acc = [];
    return through(
        function write(d) {
            acc.push(d);
            if (acc.length >= chunkSize) {
                progress.incrementTarget(acc.length);
                this.queue(acc);
                acc = [];
            }
        },
        function end() {
            if (acc.length) {
                progress.incrementTarget(acc.length);
                this.queue(acc);
            }
        },
    );
};

export default insertMany => stream =>
    new Promise((resolve, reject) => {
        safePipe(stream, [
            chunkStream(100),
            through(function(chunk) {
                insertMany(chunk)
                    .then(data => {
                        this.emit('data', data);
                        progress.incrementProgress(100);
                    })
                    .catch(error => this.emit('error', error));
            }),
        ])
            .on('error', reject)
            .on('end', resolve);

        stream.on('end', resolve);
    });
