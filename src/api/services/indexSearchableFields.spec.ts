import indexSearchableFields from './indexSearchableFields';
import mongoClient from './mongoClient';
import field from '../models/field';
import publishedDataset from '../models/publishedDataset';

jest.mock('./mongoClient');
jest.mock('../models/field');
jest.mock('../models/publishedDataset');

describe('indexSearchableFields', () => {
    it('should call createTextIndexes with findSearchable result', async () => {
        // @ts-expect-error TS(2339): Property 'mockImplementation' does not exist on ty... Remove this comment to see the full error message
        mongoClient.mockImplementation(() => 'db');
        const createTextIndexes = jest.fn();
        const findSearchableNames = jest.fn(() => 'field name list');
        // @ts-expect-error TS(2339): Property 'mockImplementation' does not exist on ty... Remove this comment to see the full error message
        field.mockImplementation(() => ({
            findSearchableNames,
        }));
        // @ts-expect-error TS(2339): Property 'mockImplementation' does not exist on ty... Remove this comment to see the full error message
        publishedDataset.mockImplementation(() => ({
            createTextIndexes,
        }));
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        await indexSearchableFields();

        expect(mongoClient).toHaveBeenCalledTimes(2);
        expect(field).toHaveBeenCalledWith('db');
        expect(publishedDataset).toHaveBeenCalledWith('db');
        expect(findSearchableNames).toHaveBeenCalledTimes(1);
        expect(createTextIndexes).toHaveBeenCalledWith('field name list');
    });
});
