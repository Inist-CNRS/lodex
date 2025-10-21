import { SearchSearchBarComponent } from './SearchSearchBar';
import { useCanAnnotate } from '../../annotation/useCanAnnotate';
import { render } from '../../../../test-utils';

jest.mock('../../annotation/useCanAnnotate', () => ({
    useCanAnnotate: jest.fn(),
}));

describe('SearchSearchBar', () => {
    it('should resetAnnotationFilter when user cannot annotate', () => {
        const resetAnnotationFilter = jest.fn();
        // @ts-expect-error TS2339
        useCanAnnotate.mockReturnValue(false);
        render(
            // @ts-expect-error TS2739
            <SearchSearchBarComponent
                resetAnnotationFilter={resetAnnotationFilter}
                hasSearchableFields
            />,
        );
        expect(resetAnnotationFilter).toHaveBeenCalled();
    });

    it('should not resetAnnotationFilter when user can annotate', () => {
        const resetAnnotationFilter = jest.fn();
        // @ts-expect-error TS2339
        useCanAnnotate.mockReturnValue(true);
        render(
            // @ts-expect-error TS2739
            <SearchSearchBarComponent
                resetAnnotationFilter={resetAnnotationFilter}
                hasSearchableFields
            />,
        );
        expect(resetAnnotationFilter).not.toHaveBeenCalled();
    });
});
