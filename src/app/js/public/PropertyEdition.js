import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import {
    fromPublication,
} from './selectors';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../propTypes';

const styles = {
    container: {
        display: 'flex',
        marginRight: '1rem',
    },
    inputContainer: {
        marginTop: '-1rem',
    },
    name: {
        fontWeight: 'bold',
    },
    scheme: {
        fontWeight: 'bold',
        fontSize: '0.75em',
        color: 'grey',
    },
};

const PropertyEdition = ({ completedField, name, label, onChange, scheme, value, p: polyglot }) => {
    let finalLabel = label;

    if (completedField) {
        finalLabel = `${label} (${polyglot.t('complete_field_X', { field: completedField.label })})`;
    }

    return (
        <dl className="property" style={styles.container}>
            <dt>
                <div style={styles.name}>{finalLabel}</div>
                <div style={styles.scheme}>{scheme}</div>
            </dt>
            <dd style={styles.inputContainer}>
                <TextField
                    name={`${name}_value`}
                    hintText="Hint Text"
                    value={value}
                    onChange={onChange}
                />
            </dd>
        </dl>
    );
};

PropertyEdition.propTypes = {
    completedField: fieldPropTypes,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    scheme: PropTypes.string,
    value: PropTypes.string.isRequired,
};

PropertyEdition.defaultProps = {
    completedField: null,
    scheme: null,
};

const mapStateToProps = (state, { name }) => ({
    completedField: fromPublication.getCompletedField(state, { name }),
});

export default compose(
    connect(mapStateToProps),
    translate,
    withHandlers({
        onChange: ({ name, onSetNewCharacteristicValue }) =>
            (event, value) => onSetNewCharacteristicValue({ name, value }),
    }),
)(PropertyEdition);
