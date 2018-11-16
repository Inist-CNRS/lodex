import indexSearchableFields from './indexSearchableFields';
import mongoClient from './mongoClient';
import field from '../models/field';
import publishedDataset from '../models/publishedDataset';

jest.mock('./mongoClient');
jest.mock('../models/field');
jest.mock('../models/publishedDataset');

describe('indexSearchableFields', () => {
    it('should call createTextIndexes with findSearchable result', async () => {
        mongoClient.mockImplementation(() => 'db');
        const createTextIndexes = jest.fn();
        const findSearchableNames = jest.fn(() => 'field name list');
        field.mockImplementation(() => ({
            findSearchableNames,
        }));
        publishedDataset.mockImplementation(() => ({
            createTextIndexes,
        }));
        await indexSearchableFields();

        expect(mongoClient).toBeCalledTimes(2);
        expect(field).toHaveBeenCalledWith('db');
        expect(publishedDataset).toHaveBeenCalledWith('db');
        expect(findSearchableNames).toBeCalledTimes(1);
        expect(createTextIndexes).toHaveBeenCalledWith('field name list');
    });
});
