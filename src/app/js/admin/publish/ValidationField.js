import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes, validationField as validationFieldPropType } from '../../propTypes';

const styles = {
    label: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginRight: '0.5rem',
        textDecoration: 'underline',
        outline: 'none',
    },
};

const ValidationFieldComponent = ({ onEditField, field: { label, properties }, p: polyglot }) => (
    <li>
        <button onClick={onEditField} style={styles.label}>{label}:</button>
        {properties.filter(p => !p.isValid).map(p => polyglot.t(`error_${p.name}_${p.error}`, p.meta)).join(', ')}
    </li>
);

ValidationFieldComponent.propTypes = {
    field: validationFieldPropType.isRequired,
    onEditField: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    withHandlers({
        onEditField: props => (event) => {
            event.preventDefault();
            props.onEditField(props.field.name);
        },
    }),
    translate,
)(ValidationFieldComponent);
