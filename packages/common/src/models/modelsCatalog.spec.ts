import fs from 'fs';
import path from 'path';
import { catalogModelSchema } from './modelCatalog';

const MODELS_DIR = path.resolve(__dirname, '../../../../src/app/custom/models');
const CATALOG_PATH = path.join(MODELS_DIR, 'models-catalog.json');
const REPO_MODELS_URL =
    'https://raw.githubusercontent.com/Inist-CNRS/lodex/marmelab/src/app/custom/models/';

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

    // A url pointing to this repository must match an archive committed here
    it('should find every repository-hosted archive in the models folder', () => {
        catalog
            .filter(({ url }: { url: string }) =>
                url.startsWith(REPO_MODELS_URL),
            )
            .forEach(({ url }: { url: string }) => {
                const file = url.slice(REPO_MODELS_URL.length);
                expect(fs.existsSync(path.join(MODELS_DIR, file))).toBe(true);
            });
    });
});
