import { PassThrough } from 'stream';
import filterVersions from '../src/filterVersions';

class Feed extends PassThrough {
    feed: any;
    constructor() {
        super({ objectMode: true });
        this.feed = {};
    }

    send(data: any) {
        this.write(data);
        this.end();
    }
}

describe('filterVersions', () => {
    it('should return all data when no versions', (done: any) => {
        const feed = new Feed();
        filterVersions(
            {
                data: 1,
            },
            feed,
        );

        feed.on('data', (data) => {
            expect(data).toEqual({ data: 1 });
            done();
        });

        feed.on('error', (e) => {
            done(e);
        });
    });

    it('should return data without versions', (done: any) => {
        const feed = new Feed();
        filterVersions(
            {
                versions: [1, 2, 3],
                data1: 1,
                data2: 2,
            },
            feed,
        );

        feed.on('data', (data) => {
            expect(data).toEqual({ data1: 1, data2: 2 });
            done();
        });

        feed.on('error', (e) => {
            done(e);
        });
    });

    it('should return the lastVersion', (done: any) => {
        const feed = new Feed();

        filterVersions(
            {
                versions: [1, 2, { v: 3 }],
                data1: 1,
                data2: 2,
            },
            feed,
        );

        feed.on('data', (data) => {
            expect(data).toEqual({ data1: 1, data2: 2, v: 3 });
            done();
        });

        feed.on('error', (e) => {
            done(e);
        });
    });
});
