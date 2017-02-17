import React from 'react';
import TextField from 'material-ui/TextField';
import withHandlers from 'recompose/withHandlers';

import { property as propertyPropTypes } from '../propTypes';

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

const PropertyEdition = ({ name, onChange, scheme, value }) => (
    <dl className="property" style={styles.container}>
        <dt>
            <div style={styles.name}>{name}</div>
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

PropertyEdition.propTypes = propertyPropTypes;

export default withHandlers({
    onChange: ({ name, onSetNewCharacteristicValue }) =>
        (event, value) => onSetNewCharacteristicValue({ name, value }),
})(PropertyEdition);
