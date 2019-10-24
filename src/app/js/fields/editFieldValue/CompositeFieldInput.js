import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import Subheader from 'material-ui/Subheader';

import FieldInput from './FieldInput';
import { fromFields } from '../../sharedSelectors';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';

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

export const canBeDirectlyEdited = transformers =>
    !transformers.some(
        ({ operation }) => !directlyEditableTransformers.includes(operation),
    );

export const CompositeFieldInputComponent = ({
    label,
    p: polyglot,
    rootField,
    isRootFieldEditable,
    compositeFields,
}) => (
    <div>
        <Subheader>{label}</Subheader>
        {isRootFieldEditable ? (
            <FieldInput field={rootField} />
        ) : (
            <span>{polyglot.t('composed_of_edit_not_possible')}</span>
        )}
        <div style={style.list}>
            {compositeFields.map(f => (
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

const mapStateToProps = (state, { field }) => ({
    rootField: {
        ...fromFields.getFieldByName(state, field.name),
        composedOf: null,
    },
    isRootFieldEditable: canBeDirectlyEdited(field.transformers),
    compositeFields: fromFields.getCompositeFieldsByField(state, field),
});

const CompositeFieldInput = compose(
    connect(mapStateToProps),
    translate,
)(CompositeFieldInputComponent);

export default CompositeFieldInput;
