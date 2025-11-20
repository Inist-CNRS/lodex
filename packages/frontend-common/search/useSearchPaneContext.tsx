import { useContext } from 'react';
import { SearchPaneContext } from './SearchPaneContext';

export function useSearchPaneContext() {
    const context = useContext(SearchPaneContext);
    if (!context) {
        throw new Error(
            'useSearchPaneContext must be used within a SearchPaneContextProvider',
        );
    }
    return context;
}
