// @ts-expect-error TS(2792): Cannot find module 'memorystream'. Did you mean to... Remove this comment to see the full error message
import MemoryStream from 'memorystream';
// @ts-expect-error TS(2792): Cannot find module 'through'. Did you mean to set ... Remove this comment to see the full error message
import through from 'through';

import safePipe from './safePipe';

describe('safePipe', () => {
    it('should pass error to the resulting stream', (done: any) => {
        const readStream = MemoryStream.createReadStream(['data']);
        const writeStream = MemoryStream.createWriteStream();

        const resultStream = safePipe(readStream, [
            through(function (this: any) {
                this.emit('error', new Error('Boom'));
            }),
            writeStream,
        ]);

        resultStream.on('error', (error: any) => {
            try {
                expect(error.message).toBe('Boom');
                done();
            } catch (error) {
                done(error);
            }
        });

        resultStream.on('end', () =>
            done(new Error('resultStream should not have ended')),
        );
    });

    it('should pass data to the resulting stream', (done: any) => {
        const readStream = new MemoryStream(['data']);
        readStream.end();
        const writeStream = MemoryStream.createWriteStream();

        const resultStream = safePipe(readStream, [
            through(function (this: any, data: any) {
                this.emit('data', data);
            }),
            writeStream,
        ]);

        resultStream.on('error', (error: any) => done(error));
        resultStream.on('data', (data: any) => expect(data).toBe('data'));

        resultStream.on('finish', () => done());
    });
});
