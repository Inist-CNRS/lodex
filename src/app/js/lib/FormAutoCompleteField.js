import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { propTypes as reduxFormPropTypes } from 'redux-form';
import AutoComplete from 'material-ui/AutoComplete';
import debounce from 'lodash.debounce';

import { fetch as fetchAction } from '../fetch';

const FormAutoCompleteField = ({ handleComplete, dataSource, input, label, meta: { error }, ...props }) => (
    <AutoComplete
        floatingLabelText={error ? (error.message || error) : label}
        onUpdateInput={debounce(handleComplete, 500)}
        onNewRequest={value => (value.text ? input.onChange(value.text) : input.onChange(value))}
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

export default connect(mapStateToProps, mapDispatchToProps)(FormAutoCompleteField);
