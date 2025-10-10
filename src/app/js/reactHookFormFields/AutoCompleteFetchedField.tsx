import { useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetch as fetchAction } from '../fetch';
import {
    AutoCompleteField,
    type AutoCompleteProps,
} from './AutoCompleteField.tsx';

type AutoCompleteFetchedFieldProps = AutoCompleteProps & {
    dataSource: any;
    getFetchRequest: (searchText: string) => { url: string };
    parseResponse: (response: any) => any;
    handleSearch: (searchText: string) => void;
};

const AutoCompleteFetchedField = ({
    dataSource,
    allowNewItem = false,
    getFetchRequest: _getFetchRequest,
    parseResponse: _parseResponse,
    handleSearch,
    ...props
}: AutoCompleteFetchedFieldProps) => {
    const source = dataSource || [];

    const handleComplete = useCallback(
        (_, searchText) => {
            if (allowNewItem) {
                handleSearch(searchText);
            }
        },
        [handleSearch],
    );

    return (
        <AutoCompleteField
            {...props}
            allowNewItem={allowNewItem}
            options={source}
            freeSolo
            getOptionLabel={(option) => option.text}
            onInputChange={handleComplete}
        />
    );
};

const mapStateToProps = (
    // @ts-expect-error TS7031
    { fetch },
    { name, parseResponse }: AutoCompleteFetchedFieldProps,
) => ({
    dataSource: parseResponse(fetch[name] && fetch[name].response),
});

const mapDispatchToProps = (
    // @ts-expect-error TS7006
    dispatch,
    { name, getFetchRequest }: AutoCompleteFetchedFieldProps,
) =>
    bindActionCreators(
        {
            handleSearch: (searchText) =>
                searchText
                    ? fetchAction({ config: getFetchRequest(searchText), name })
                    : { type: '@@NULL' }, // We must return an action so return an action which will not be handled
        },
        dispatch,
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AutoCompleteFetchedField);
