import debounce from 'lodash/debounce';
import { useCallback, useEffect, useState, useRef } from 'react';

const DEBOUNCE_TIMEOUT = 500;

const useSearchBar = (
    defaultQuery = '',
    onSearch = () => {},
    onSearchClear = () => {},
    debounceTimeout = DEBOUNCE_TIMEOUT,
    serverSideSearch = false,
) => {
    const [query, setQuery] = useState(defaultQuery || '');
    const isUserInputRef = useRef(false);
    const lastDefaultQueryRef = useRef(defaultQuery);

    const normalizeAccents = useCallback(
        (text) => {
            // For server-side search, let the server handle normalization
            if (serverSideSearch || !text || typeof text !== 'string') {
                return text;
            }
            return text
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .trim();
        },
        [serverSideSearch],
    );

    const debouncedSearch = useCallback(
        debounce((value) => {
            const processedValue = normalizeAccents(value);
            onSearch(processedValue);
        }, debounceTimeout),
        [onSearch, debounceTimeout, normalizeAccents],
    );

    useEffect(() => {
        if (
            defaultQuery !== lastDefaultQueryRef.current &&
            !isUserInputRef.current
        ) {
            setQuery(defaultQuery || '');
            lastDefaultQueryRef.current = defaultQuery;
        }
    }, [defaultQuery]);

    const search = useCallback(
        (value) => {
            isUserInputRef.current = true;
            setQuery(value);
            debouncedSearch(value);

            setTimeout(() => {
                isUserInputRef.current = false;
            }, debounceTimeout + 100);
        },
        [debouncedSearch, debounceTimeout],
    );

    const clearSearch = useCallback(() => {
        isUserInputRef.current = true;
        setQuery('');
        debouncedSearch.cancel();
        onSearch('');
        onSearchClear();

        setTimeout(() => {
            isUserInputRef.current = false;
        }, 100);
    }, [debouncedSearch, onSearch, onSearchClear]);

    return [query, search, clearSearch];
};

export default useSearchBar;
