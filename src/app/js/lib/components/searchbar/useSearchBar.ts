// @ts-expect-error TS7016
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
        // @ts-expect-error TS7006
        debounce((value) => {
            // @ts-expect-error TS2554
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

    // @ts-expect-error TS7006
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
