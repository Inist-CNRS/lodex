import MemoryStream from 'memorystream';
import through from 'through';

import safePipe from './safePipe';

describe('safePipe', () => {
    it('should pass error to the resulting stream', done => {
        const readStream = MemoryStream.createReadStream(['data']);
        const writeStream = MemoryStream.createWriteStream();

        const resultStream = safePipe(readStream, [
            through(function() {
                this.emit('error', new Error('Boom'));
            }),
            writeStream,
        ]);

        resultStream.on('error', error => {
            try {
                expect(error.message).toEqual('Boom');
                done();
            } catch (error) {
                done(error);
            }
        });

        resultStream.on('end', () =>
            done(new Error('resultStream should not have ended')),
        );
    });

    it('should pass data to the resulting stream', done => {
        const readStream = new MemoryStream(['data']);
        readStream.end();
        const writeStream = MemoryStream.createWriteStream();

        const resultStream = safePipe(readStream, [
            through(function(data) {
                this.emit('data', data);
            }),
            writeStream,
        ]);

        resultStream.on('error', error => done(error));
        resultStream.on('data', data => expect(data).toBe('data'));

        resultStream.on('finish', () => done());
    });
});
