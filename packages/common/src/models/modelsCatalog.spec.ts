import fs from 'fs';
import path from 'path';
import { catalogModelSchema } from './modelCatalog';

const CATALOG_PATH = path.resolve(
    __dirname,
    '../../../../src/app/custom/models/models-catalog.json',
);

describe('models catalog', () => {
    const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));

    it('should be a valid JSON array', () => {
        expect(Array.isArray(catalog)).toBe(true);
    });

    // getDisplayableModels silently skips invalid entries at runtime,
    // so make sure the models we ship ourselves are valid
    it('should only contain valid models', () => {
        catalog.forEach((model: unknown) => {
            expect(catalogModelSchema.safeParse(model).success).toBe(true);
        });
    });
});
