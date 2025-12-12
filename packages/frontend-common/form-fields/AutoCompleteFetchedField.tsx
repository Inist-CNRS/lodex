import { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetch as fetchAction } from '../fetch/reducer';
import {
    AutoCompleteField,
    type AutoCompleteProps,
} from './AutoCompleteField.tsx';
import type { SharedState } from '../sharedReducers.ts';

type AutoCompleteFetchedFieldProps = Omit<AutoCompleteProps, 'options'> & {
    getFetchRequest: (searchText: string) => { url: string };
    parseResponse: (response: any) => any;
};

const AutoCompleteFetchedField = ({
    allowNewItem = false,
    name,
    getFetchRequest,
    parseResponse,
    ...props
}: AutoCompleteFetchedFieldProps) => {
    const currentSearch = useRef<string | null>(null);

    const fetch = useSelector((state: SharedState) => state.fetch);
    const source = useMemo(
        () => parseResponse(fetch[name] && fetch[name].response) || [],
        [fetch, name, parseResponse],
    );

    const dispatch = useDispatch();

    const handleSearch = useCallback(
        (searchText: string) => {
            if (!searchText || currentSearch.current === searchText) return;
            // Avoid to re-fetch for the same search text
            currentSearch.current = searchText;
            dispatch(
                fetchAction({ config: getFetchRequest(searchText), name }),
            );
        },
        [dispatch, getFetchRequest, name],
    );

    const handleComplete = useCallback(
        (_: unknown, searchText: string) => {
            handleSearch(searchText);
        },
        [handleSearch],
    );

    return (
        <AutoCompleteField
            {...props}
            name={name}
            allowNewItem={allowNewItem}
            options={source}
            freeSolo
            getOptionLabel={(option) => option.text}
            onInputChange={handleComplete}
        />
    );
};

export default AutoCompleteFetchedField;
