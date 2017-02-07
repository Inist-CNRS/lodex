import React from 'react';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { propTypes as reduxFormPropTypes } from 'redux-form';
import AutoComplete from 'material-ui/AutoComplete';
import debounce from 'lodash.debounce';

import { fetch as fetchAction } from '../fetch';

const FormAutoCompleteField = ({
    handleComplete,
    handleValueChosen,
    dataSource,
    input,
    label,
    meta: { error },
    ...props,
}) => (
    <AutoComplete
        floatingLabelText={error ? (error.message || error) : label}
        onUpdateInput={debounce(handleComplete, 500)}
        onNewRequest={handleValueChosen}
        dataSource={dataSource}
        searchText={input.value}
        {...props}
    />
);

FormAutoCompleteField.propTypes = reduxFormPropTypes;

const mapStateToProps = ({ fetch }, { input: { name }, parseResponse }) => ({
    dataSource: parseResponse(fetch[name] && fetch[name].response),
});

const mapDispatchToProps = (dispatch, { input: { name }, fetch: getConfig }) => bindActionCreators({
    handleComplete: searchText => (
        searchText
            ? fetchAction({ config: getConfig(searchText), name })
            : { type: '@@NULL' } // We must return an action so return an action which will not be handled
        ),
}, dispatch);

const handleValueChosen = ({ allowNewItem, input: { onChange } }) => (value, index) => {
    // Material UI doc: index is the index in dataSource of the list item selected,
    // or -1 if enter is pressed in the TextField
    if (!allowNewItem && index === -1) {
        return onChange('');
    }

    return value.text ? onChange(value.text) : onChange(value);
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({ handleValueChosen }),
)(FormAutoCompleteField);
