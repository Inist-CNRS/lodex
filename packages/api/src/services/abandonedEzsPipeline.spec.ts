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
});

// the error ezs gives for a failed statement, as the late timeout of a
// stalled one
const getStatementError = () =>
    new Promise<Error>((resolve) => {
        const input = new PassThrough({ objectMode: true });
        input
            .pipe(ezs('delegate', { script: '[abandonedPipelineFail]\n' }))
            .on('data', () => {})
            .on('error', resolve);
        input.end({});
    });

describe('isAbandonedEzsPipelineError', () => {
    it('recognizes the error of an ezs statement', async () => {
        expect(isAbandonedEzsPipelineError(await getStatementError())).toBe(
            true,
        );
    });

    it('leaves any other error to stop the process', () => {
        expect(isAbandonedEzsPipelineError(new Error('bug'))).toBe(false);
        expect(isAbandonedEzsPipelineError(undefined)).toBe(false);
        expect(isAbandonedEzsPipelineError(null)).toBe(false);
    });
});
