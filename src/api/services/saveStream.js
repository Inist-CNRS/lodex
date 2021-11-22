import through from 'through';

import safePipe from './safePipe';
import progress from './progress';

const defaultChunkSize = 100;

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

export default upsertMany => (stream, modifier) =>
    new Promise((resolve, reject) => {
        safePipe(stream, [
            chunkStream(defaultChunkSize),
            through(function(chunk) {
                typeof modifier !== 'function'
                    ? this.queue(chunk)
                    : modifier(chunk)
                          .then(this.queue)
                          .catch(error => this.emit('error', error));
            }),
            through(function(chunk) {
                upsertMany(chunk)
                    .then(data => {
                        this.emit('data', data);
                        progress.incrementProgress(data.length);
                    })
                    .catch(error => this.emit('error', error));
            }),
        ])
            .on('error', reject)
            .on('end', resolve);

        stream.on('end', resolve);
    });
