import debounce from 'lodash/debounce';
import { useCallback, useEffect, useState } from 'react';

const DEBOUNCE_TIMEOUT = 500;

const useSearchBar = (
    defaultQuery = '',
    onSearch = () => {},
    onSearchClear = () => {},
    debounceTimeout = DEBOUNCE_TIMEOUT,
) => {
    const [query, setQuery] = useState(defaultQuery || '');

    const debouncedSearch = useCallback(
        debounce((value) => {
            onSearch(value);
        }, debounceTimeout),
        [],
    );

    useEffect(() => {
        if (query || !defaultQuery) {
            return;
        }
        setQuery(defaultQuery);
    }, [defaultQuery]);

    const search = (value) => {
        setQuery(value);
        debouncedSearch(value);
    };

    const clearSearch = () => {
        search('');
        onSearchClear();
    };

    return [query, search, clearSearch];
};

export default useSearchBar;
