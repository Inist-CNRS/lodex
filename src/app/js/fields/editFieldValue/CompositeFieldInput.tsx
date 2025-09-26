import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { ListSubheader } from '@mui/material';
// @ts-expect-error TS7016
import { Field } from 'redux-form';

import { getEditionComponent } from '../../formats';
import FieldInput from './FieldInput';
import { fromFields } from '../../sharedSelectors';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { translate } from '../../i18n/I18NContext';

const style = {
    list: {
        paddingLeft: '25px',
    },
};

export const directlyEditableTransformers = [
    'COLUMN',
    'UPPERCASE',
    'LOWERCASE',
    'VALUE',
    'NUMBER',
    'BOOLEAN',
    'TRIM',
    'CAPITALIZE',
];

// @ts-expect-error TS7006
export const canBeDirectlyEdited = (transformers) =>
    !transformers.some(
        // @ts-expect-error TS7031
        ({ operation }) => !directlyEditableTransformers.includes(operation),
    );

export const CompositeFieldInputComponent = ({
    // @ts-expect-error TS7031
    label,
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    rootField,
    // @ts-expect-error TS7031
    isRootFieldEditable,
    // @ts-expect-error TS7031
    compositeFields,
}) => (
    <div>
        <ListSubheader>{label}</ListSubheader>
        <div style={style.list}>
            {isRootFieldEditable ? (
                <Field
                    key={rootField.name}
                    name={rootField.name}
                    field={rootField}
                    component={getEditionComponent(rootField)}
                    fullWidth
                />
            ) : (
                polyglot.t('composed_of_edit_not_possible')
            )}
        </div>
        <div style={style.list}>
            {/*
             // @ts-expect-error TS7006 */}
            {compositeFields.map((f) => (
                // @ts-expect-error TS2322
                <FieldInput key={f.name} field={f} />
            ))}
        </div>
    </div>
);

CompositeFieldInputComponent.propTypes = {
    label: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
    rootField: fieldPropTypes.isRequired,
    isRootFieldEditable: PropTypes.bool,
    compositeFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
};

CompositeFieldInputComponent.defaultProps = {
    isRootFieldEditable: false,
    compositeFields: null,
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { field }) => ({
    rootField: {
        // @ts-expect-error TS2339
        ...fromFields.getFieldByName(state, field.name),
        composedOf: null,
    },
    isRootFieldEditable: canBeDirectlyEdited(field.transformers),
    // @ts-expect-error TS2339
    compositeFields: fromFields.getCompositeFieldsByField(state, field),
});

const CompositeFieldInput = compose(
    connect(mapStateToProps),
    translate,
    // @ts-expect-error TS2345
)(CompositeFieldInputComponent);

export default CompositeFieldInput;
