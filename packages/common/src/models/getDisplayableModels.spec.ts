import { getDisplayableModels } from './getDisplayableModels';

describe('getDisplayableModels', () => {
    const valid = {
        id: 'm',
        url: 'https://x/m.tar',
        loader: 'csv',
        importTypes: ['file'],
    };
    const options = {
        availableLoaders: ['csv'],
        hasTranslation: () => true,
    };

    it('should return a valid model', () => {
        expect(getDisplayableModels([valid], options)).toStrictEqual([valid]);
    });

    it.each([undefined, null, {}, 'models'])(
        'should return an empty list when models is not an array (%p)',
        (models) => {
            expect(getDisplayableModels(models, options)).toStrictEqual([]);
        },
    );

    it('should filter out entries that are not objects', () => {
        expect(
            getDisplayableModels([null, 'str', [], 42, valid], options),
        ).toStrictEqual([valid]);
    });

    it.each(['id', 'url', 'loader', 'importTypes'])(
        'should filter out a model with a missing or empty %s',
        (field) => {
            const { [field]: _removed, ...withoutField } = valid as Record<
                string,
                unknown
            >;
            expect(getDisplayableModels([withoutField], options)).toStrictEqual(
                [],
            );
            expect(
                getDisplayableModels([{ ...valid, [field]: '' }], options),
            ).toStrictEqual([]);
        },
    );

    it.each([['Disabled'], ['disabled'], ['other', 'Disabled']])(
        'should filter out a model tagged %p',
        (...tags) => {
            expect(
                getDisplayableModels([{ ...valid, tags }], options),
            ).toStrictEqual([]);
        },
    );

    it.each([[undefined], [[]], [['other']]])(
        'should keep a model whose tags are %p',
        (tags) => {
            const model = { ...valid, tags };
            expect(getDisplayableModels([model], options)).toHaveLength(1);
        },
    );

    it('should filter out a model with an empty importTypes list', () => {
        expect(
            getDisplayableModels([{ ...valid, importTypes: [] }], options),
        ).toStrictEqual([]);
    });

    it('should filter out a model with duplicate importTypes', () => {
        expect(
            getDisplayableModels(
                [{ ...valid, importTypes: ['text', 'text'] }],
                options,
            ),
        ).toStrictEqual([]);
    });

    it('should filter out a model whose loader is not available on the instance', () => {
        expect(
            getDisplayableModels([{ ...valid, loader: 'other' }], options),
        ).toStrictEqual([]);
    });

    it.each(['mc_m_title', 'mc_m_description'])(
        'should filter out a model without the %s translation',
        (missingKey) => {
            const hasTranslation = jest.fn((key: string) => key !== missingKey);
            expect(
                getDisplayableModels([valid], { ...options, hasTranslation }),
            ).toStrictEqual([]);
            expect(hasTranslation).toHaveBeenCalledWith(missingKey);
        },
    );

    it.each([
        [
            'the allowed launch order example',
            {
                launchOrder: [
                    { name: 'PrecalculX', type: 'precomputed', position: 2 },
                    {
                        name: 'EnrichissementA',
                        type: 'enrichment',
                        position: 1,
                    },
                    {
                        name: 'EnrichissementB',
                        type: 'enrichment',
                        position: 2,
                    },
                    { name: 'PrecalculY', type: 'precomputed', position: 2 },
                ],
            },
        ],
        [
            'several precomputed at the same position',
            {
                launchOrder: [
                    { name: 'PrecalculX', type: 'precomputed', position: 1 },
                    { name: 'PrecalculY', type: 'precomputed', position: 1 },
                ],
            },
        ],
        ['a recommended theme', { theme: 'inist' }],
        ['known import types', { importTypes: ['file', 'url'] }],
    ])('should accept %s', (_label, overrides) => {
        const model = { ...valid, ...overrides };
        expect(getDisplayableModels([model], options)).toStrictEqual([model]);
    });

    it('should reject two enrichments at the same position', () => {
        const model = {
            ...valid,
            launchOrder: [
                { name: 'EnrichissementA', type: 'enrichment', position: 1 },
                { name: 'EnrichissementB', type: 'enrichment', position: 1 },
                { name: 'PrecalculX', type: 'precomputed', position: 2 },
                { name: 'PrecalculY', type: 'precomputed', position: 2 },
            ],
        };
        expect(getDisplayableModels([model], options)).toStrictEqual([]);
    });

    it('should accept an empty launch order as a missing one', () => {
        expect(
            getDisplayableModels([{ ...valid, launchOrder: [] }], options),
        ).toStrictEqual([valid]);
    });

    it('should treat empty doc, demo and theme as missing', () => {
        expect(
            getDisplayableModels(
                [{ ...valid, doc: '', demo: '', theme: '' }],
                options,
            ),
        ).toStrictEqual([valid]);
    });

    it.each([
        ['empty name', [{ name: '', type: 'enrichment', position: 1 }]],
        ['unknown type', [{ name: 'a', type: 'other', position: 1 }]],
        ['position 0', [{ name: 'a', type: 'enrichment', position: 0 }]],
        [
            'decimal position',
            [{ name: 'a', type: 'enrichment', position: 1.5 }],
        ],
        ['string position', [{ name: 'a', type: 'enrichment', position: '2' }]],
        ['null entry', [null]],
        ['non-array launch order', 'a:1'],
    ])('should reject a malformed launch order (%s)', (_label, launchOrder) => {
        expect(
            getDisplayableModels([{ ...valid, launchOrder }], options),
        ).toStrictEqual([]);
    });

    it.each([[['ftp']], ['file']])(
        'should reject invalid import types (%p)',
        (importTypes) => {
            expect(
                getDisplayableModels([{ ...valid, importTypes }], options),
            ).toStrictEqual([]);
        },
    );

    it.each([
        ['doc', 42],
        ['demo', {}],
        ['theme', ['inist']],
        ['theme', 42],
    ])('should reject a malformed optional field (%s: %p)', (field, value) => {
        expect(
            getDisplayableModels([{ ...valid, [field]: value }], options),
        ).toStrictEqual([]);
    });

    it.each([
        ['url', 'javascript:alert(1)'],
        ['url', '/relative/model.tar'],
        ['doc', 'javascript:alert(1)'],
        ['doc', 'www.lodex.fr/docs'],
        ['demo', 'ftp://lodex.fr/demo'],
    ])('should reject a non http(s) link (%s: %p)', (field, value) => {
        expect(
            getDisplayableModels([{ ...valid, [field]: value }], options),
        ).toStrictEqual([]);
    });

    it('should accept http and https links', () => {
        const model = {
            ...valid,
            url: 'http://x/m.tar',
            doc: 'https://x/doc',
            demo: 'HTTPS://x/demo',
        };
        expect(getDisplayableModels([model], options)).toStrictEqual([model]);
    });

    it('should keep only the first model when ids are duplicated', () => {
        expect(
            getDisplayableModels(
                [valid, { ...valid, url: 'https://x/other.tar' }],
                options,
            ),
        ).toStrictEqual([valid]);
    });

    it('should hide a duplicate even when the first model with that id is invalid', () => {
        expect(
            getDisplayableModels(
                [{ ...valid, loader: 'nope' }, valid],
                options,
            ),
        ).toStrictEqual([]);
    });

    it('should preserve the catalog order', () => {
        const a = { ...valid, id: 'a' };
        const b = { ...valid, id: 'b' };
        expect(getDisplayableModels([a, b], options)).toStrictEqual([a, b]);
    });
});
