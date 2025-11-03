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
    const timeoutRef = useRef(null);

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

    // Cleanup effect to cancel debounced function and clear timeouts on unmount
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [debouncedSearch]);

    const search = useCallback(
        (value) => {
            isUserInputRef.current = true;
            setQuery(value);
            debouncedSearch(value);

            // Clear any existing timeout before setting a new one
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                isUserInputRef.current = false;
                timeoutRef.current = null;
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

        // Clear any existing timeout before setting a new one
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            isUserInputRef.current = false;
            timeoutRef.current = null;
        }, 100);
    }, [debouncedSearch, onSearch, onSearchClear]);

    return [query, search, clearSearch];
};

export default useSearchBar;
