import { PassThrough } from 'stream';
import filterContributions from './filterContributions';
import { PROPOSED, REJECTED, VALIDATED } from '../../common/propositionStatus';

class Feed extends PassThrough {
    constructor() {
        super({ objectMode: true });
        this.feed = {};
    }
    send(data) {
        this.write(data);
        this.end();
    }
}

describe('filterContributions', () => {
    it('should return all data when no contributions', done => {
        const feed = new Feed();
        filterContributions(
            {
                data: 1,
            },
            feed,
        );

        feed.on('data', data => {
            expect(data).toEqual({ data: 1 });
            done();
        });

        feed.on('error', e => {
            done(e);
        });
    });

    it('should not return PROPOSED contributions', done => {
        const feed = new Feed();
        filterContributions(
            {
                data: 1,
                proposed: true,
                contributions: [{ status: PROPOSED, fieldName: 'proposed' }],
            },
            feed,
        );

        feed.on('data', data => {
            expect(data).toEqual({ data: 1 });
            done();
        });

        feed.on('error', e => {
            done(e);
        });
    });

    it('should not return REJECTED contributions', done => {
        const feed = new Feed();
        filterContributions(
            {
                data: 1,
                rejected: true,
                contributions: [{ status: REJECTED, fieldName: 'rejected' }],
            },
            feed,
        );

        feed.on('data', data => {
            expect(data).toEqual({ data: 1 });
            done();
        });

        feed.on('error', e => {
            done(e);
        });
    });

    it('should return VALIDATED contributions', done => {
        const feed = new Feed();
        filterContributions(
            {
                data: 1,
                validated: true,
                contributions: [{ status: VALIDATED, fieldName: 'validated' }],
            },
            feed,
        );

        feed.on('data', data => {
            expect(data).toEqual({ data: 1, validated: true });
            done();
        });

        feed.on('error', e => {
            done(e);
        });
    });

    it('should remove contributions and contributionCount', done => {
        const feed = new Feed();
        filterContributions(
            {
                data: 1,
                contributions: [],
                contributionCount: 0,
            },
            feed,
        );

        feed.on('data', data => {
            expect(data).toEqual({ data: 1 });
            done();
        });

        feed.on('error', e => {
            done(e);
        });
    });
});
