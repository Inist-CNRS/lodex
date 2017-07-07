import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import memoize from 'lodash.memoize';
import { Field } from 'redux-form';
import get from 'lodash.get';
import IconButton from 'material-ui/IconButton';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';

import FormAutoCompleteField from '../lib/components/FormTextField';
import { fromFields } from '../sharedSelectors';
import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../propTypes';

const required = polyglot => value => (value ? undefined : polyglot.t('required'));
// const uniqueField = (fields, polyglot) => (value, _, props) =>
    // (get(props, 'field.label') !== value && fields.find(({ label }) => label === value) ? polyglot.t('field_label_exists') : undefined);

const getValidation = memoize((fields, polyglot) => [
    required(polyglot),
    // uniqueField(fields, polyglot),
]);

export const ClassListItem = ({ fieldName, fields, disabled, p: polyglot }) => (
    <div>
        <Field
            label={fieldName}
            name={`${fieldName}.class`}
            component={FormAutoCompleteField}
            fullWidth
            disabled={disabled}
        />
        <IconButton
            tooltip="remove class"
        >
            <ActionDeleteIcon />
        </IconButton>
    </div>
);

ClassListItem.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    disabled: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
};

ClassListItem.defaultProps = {
    validate: false,
    isNewField: false,
    disabled: false,
};

const mapStateToProps = state => ({
    fields: fromFields.getFields(state),
});

export default compose(
    connect(mapStateToProps),
    translate,
)(ClassListItem);
