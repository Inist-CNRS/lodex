import reducer, { importFields, importFieldsSuccess } from './index';

describe('import reducer', () => {
    it('should reset the previous import result when a new import starts', () => {
        const afterImport = reducer(
            undefined,
            importFieldsSuccess({
                hasEnrichments: true,
                hasPrecomputed: true,
                themeNotFound: 'istex',
            }),
        );

        expect(reducer(afterImport, importFields('file'))).toEqual({
            status: null,
            loading: true,
            hasEnrichments: false,
            hasPrecomputed: false,
            themeNotFound: null,
        });
    });
});
