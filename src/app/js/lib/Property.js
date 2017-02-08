import React, { PropTypes } from 'react';
import { property: propertyPropTypes } from './propTypes';

const styles = {
    container: {
        display: 'flex',
        marginRight: '1rem',
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

const Property = ({ name, value, scheme }) => (
    <dl className="property" style={styles.container}>
        <dt>
            <div style={styles.name}>{name}</div>
            <div style={styles.scheme}>{scheme}</div>
        </dt>
        <dd>{value}</dd>
    </dl>
);

Property.propTypes = propertyPropTypes;

export default Property;
