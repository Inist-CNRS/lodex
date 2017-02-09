import React from 'react';
import { property as propertyPropTypes } from './propTypes';

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
            <div className="property_name" style={styles.name}>{name}</div>
            <div className="property_scheme" style={styles.scheme}>{scheme}</div>
        </dt>
        <dd>{value}</dd>
    </dl>
);

Property.propTypes = propertyPropTypes;

export default Property;
