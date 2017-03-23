import React, { PropTypes } from 'react';
import MenuItem from 'material-ui/MenuItem';
import { Field } from 'redux-form';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import FormSelectField from '../../lib/FormSelectField';
import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../propTypes';
import { fromFields } from '../selectors';

export const ComposedOfFieldListItemComponent = ({ fieldName, availableFields, p: polyglot }) => (
    <Field
        className="composite-field"
        name={fieldName}
        type="text"
        component={FormSelectField}
        label={polyglot.t('select_a_field')}
    >
        {availableFields.map(
            f => <MenuItem key={f.name} className={`field_${f.name}`} value={f.name} primaryText={f.label} />,
        )}
    </Field>
);

ComposedOfFieldListItemComponent.propTypes = {
    fieldName: PropTypes.string.isRequired,
    availableFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = (state, { fieldName }) => ({
    fieldName,
    availableFields: fromFields.getFieldsExceptEdited(state),
});

export default compose(
    translate,
    connect(mapStateToProps),
)(ComposedOfFieldListItemComponent);
