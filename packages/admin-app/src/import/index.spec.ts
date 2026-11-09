import { signOut } from '@lodex/frontend-common/user/reducer';
import reducer, {
    importFields,
    importFieldsSuccess,
    initialState,
} from './index';

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

    // Menu remounts on the next login and would replay the last result
    it('should forget the last import result on sign out', () => {
        const afterImport = reducer(
            undefined,
            importFieldsSuccess({ themeNotFound: 'istex' }),
        );

        expect(reducer(afterImport, signOut())).toEqual(initialState);
    });
});
