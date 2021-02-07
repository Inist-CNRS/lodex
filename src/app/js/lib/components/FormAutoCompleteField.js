import React from 'react';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { FormControl, FormHelperText, TextField } from '@material-ui/core';
import translate from 'redux-polyglot/translate';

import { fetch as fetchAction } from '../../fetch';
import { formField as formFieldPropTypes } from '../../propTypes';

const FormAutoCompleteField = ({
    allowNewItem,
    handleComplete,
    handleValueChosen,
    dataSource,
    input,
    label,
    meta: { error },
    p: polyglot,
    ...props
}) => {
    const source = dataSource || [];

    return (
        <FormControl fullWidth>
            <Autocomplete
                id="autocomplete"
                options={source}
                getOptionLabel={option => option.text}
                renderInput={params => <TextField {...params} label={label} />}
                onChange={handleValueChosen}
                onInputChange={handleComplete}
                noOptionsText={polyglot.t('no_option')}
            />
            <FormHelperText>
                {error ? error.message || error : label}
            </FormHelperText>
        </FormControl>
    );
};

FormAutoCompleteField.propTypes = formFieldPropTypes;

const mapStateToProps = ({ fetch }, { input: { name }, parseResponse }) => ({
    dataSource: parseResponse(fetch[name] && fetch[name].response),
});

const mapDispatchToProps = (dispatch, { input: { name }, getFetchRequest }) =>
    bindActionCreators(
        {
            handleSearch: searchText =>
                searchText
                    ? fetchAction({ config: getFetchRequest(searchText), name })
                    : { type: '@@NULL' }, // We must return an action so return an action which will not be handled
        },
        dispatch,
    );

const handleValueChosen = ({ allowNewItem, input: { onChange } }) => (
    event,
    value,
) => {
    // Material UI doc: index is the index in dataSource of the list item selected,
    // or -1 if enter is pressed in the TextField
    if (!allowNewItem && index === -1) {
        return onChange('');
    }

    return value.text ? onChange(value.text) : onChange(value);
};

const handleComplete = ({
    allowNewItem,
    input: { onChange },
    handleSearch,
}) => (event, searchText) => {
    if (allowNewItem) {
        onChange(searchText);
        handleSearch(searchText);
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({ handleValueChosen, handleComplete }),
    translate,
)(FormAutoCompleteField);
