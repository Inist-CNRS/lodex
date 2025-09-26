import React from 'react';
import { SearchSearchBarComponent } from './SearchSearchBar';
import { useCanAnnotate } from '../../annotation/useCanAnnotate';
import { render } from '../../../../test-utils';

jest.mock('../../annotation/useCanAnnotate', () => ({
    useCanAnnotate: jest.fn(),
}));

describe('SearchSearchBar', () => {
    it('should resetAnnotationFilter when user cannot annotate', () => {
        const resetAnnotationFilter = jest.fn();
        useCanAnnotate.mockReturnValue(false);
        render(
            <SearchSearchBarComponent
                resetAnnotationFilter={resetAnnotationFilter}
                hasSearchableFields
            />,
        );
        expect(resetAnnotationFilter).toHaveBeenCalled();
    });

    it('should not resetAnnotationFilter when user can annotate', () => {
        const resetAnnotationFilter = jest.fn();
        useCanAnnotate.mockReturnValue(true);
        render(
            <SearchSearchBarComponent
                resetAnnotationFilter={resetAnnotationFilter}
                hasSearchableFields
            />,
        );
        expect(resetAnnotationFilter).not.toHaveBeenCalled();
    });
});
