import React from 'react';
import omit from 'lodash.omit';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import AutoComplete from '@material-ui/core/AutoComplete';

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
    ...props
}) => (
    <AutoComplete
        floatingLabelText={error ? error.message || error : label}
        onUpdateInput={handleComplete}
        onNewRequest={handleValueChosen}
        dataSource={dataSource}
        searchText={input.value}
        {...omit(props, ['getFetchRequest', 'parseResponse', 'handleSearch'])}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
    />
);

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
    value,
    index,
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
}) => searchText => {
    if (allowNewItem) {
        onChange(searchText);
        handleSearch(searchText);
    }
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    withHandlers({ handleValueChosen, handleComplete }),
)(FormAutoCompleteField);
