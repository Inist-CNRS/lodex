import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetch as fetchAction } from '../fetch';
import {
    AutoCompleteField,
    type AutoCompleteProps,
} from './AutoCompleteField.tsx';
import type { State } from '../admin/reducers.ts';

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
    const fetch = useSelector((state: State) => state.fetch);
    const dataSource = parseResponse(fetch[name] && fetch[name].response);
    const source = dataSource || [];

    const dispatch = useDispatch();
    const handleSearch = (searchText: string) => {
        if (!searchText) return;
        dispatch(fetchAction({ config: getFetchRequest(searchText), name }));
    };

    const handleComplete = useCallback(
        (_, searchText) => {
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
