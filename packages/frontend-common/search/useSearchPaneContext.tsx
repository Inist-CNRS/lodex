import { useContext } from 'react';
import {
    SearchPaneContext,
    type SearchPaneContextType,
} from './SearchPaneContext';

export function useSearchPaneContext() {
    const context = useContext(SearchPaneContext);
    if (!context) {
        throw new Error(
            'useSearchPaneContext must be used within a SearchPaneContextProvider',
        );
    }
    return context;
}

const defaultSearchPaneContext: SearchPaneContextType = {
    filters: [],
    selectOne() {},
    selectMany() {},
    clearFilters() {},
};

export function useSearchPaneContextOrDefault() {
    const context = useContext(SearchPaneContext);
    if (!context) {
        return defaultSearchPaneContext;
    }
    return context;
}
