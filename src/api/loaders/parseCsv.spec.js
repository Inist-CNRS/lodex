import expect, { createSpy } from 'expect';

import { parseCsvFactory } from './parseCsv';

describe('parseCsv', () => {
    it('should return document based on received csv Stream', () => {
        const parseCsvImpl = createSpy().andReturn('csvParser');
        const stream = {
            pipe: createSpy(),
        };

        parseCsvFactory(parseCsvImpl)({
            delimiter: ';',
        })(stream);

        expect(parseCsvImpl).toHaveBeenCalledWith({
            delimiter: ';',
            columns: true,
        });

        expect(stream.pipe).toHaveBeenCalledWith('csvParser');
    });
});
