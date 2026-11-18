// @ts-expect-error TS(7016): @ezs/core has no types
import ezs from '@ezs/core';
import { PassThrough } from 'stream';
import { isAbandonedEzsPipelineError } from './abandonedEzsPipeline';

ezs.use({
    // as URLConnect when the web service closes the connection
    abandonedPipelineFail(this: any, _data: any, feed: any) {
        if (this.isLast()) {
            return feed.close();
        }
        feed.stop(new Error('other side closed'));
    },
    // as paginateQuery stalled by the dead pipeline after it
    abandonedPipelineStall(this: any, _data: any, feed: any) {
        if (this.isLast()) {
            return feed.close();
        }
        feed.flow(new PassThrough({ objectMode: true }));
    },
});

// the error ezs gives for a statement of this script
const getStatementError = (script: string) =>
    new Promise<Error>((resolve) => {
        const input = new PassThrough({ objectMode: true });
        input
            .pipe(ezs('delegate', { script }))
            .on('data', () => {})
            .on('error', resolve);
        input.end({});
    });

describe('isAbandonedEzsPipelineError', () => {
    let timeout: number;
    beforeEach(() => {
        timeout = ezs.settings.feed.timeout;
        ezs.settings.feed.timeout = 100;
    });
    afterEach(() => {
        ezs.settings.feed.timeout = timeout;
    });

    it('recognizes the timeout of a stalled ezs statement', async () => {
        const error = await getStatementError('[abandonedPipelineStall]\n');
        expect(isAbandonedEzsPipelineError(error)).toBe(true);
    });

    it('leaves any other error to stop the process', async () => {
        const error = await getStatementError('[abandonedPipelineFail]\n');
        expect(isAbandonedEzsPipelineError(error)).toBe(false);
        expect(isAbandonedEzsPipelineError(new Error('bug'))).toBe(false);
        expect(isAbandonedEzsPipelineError(undefined)).toBe(false);
        expect(isAbandonedEzsPipelineError(null)).toBe(false);
    });
});
