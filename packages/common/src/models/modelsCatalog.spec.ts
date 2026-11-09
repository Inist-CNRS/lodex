import fs from 'fs';
import path from 'path';

const CATALOG_PATH = path.resolve(
    __dirname,
    '../../../../src/app/custom/models/models-catalog.json',
);

describe('models catalog', () => {
    it('should be a valid JSON array', () => {
        const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
        expect(Array.isArray(catalog)).toBe(true);
    });
});
