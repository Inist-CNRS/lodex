import React from 'react';
import { connect } from 'react-redux';

import { property as propertyPropTypes } from './propTypes';
import {
    getResourceUnvalidatedFields,
    getResourceContributorsByField,
} from '../resource';

const styles = {
    container: unValidated => ({
        display: 'flex',
        marginRight: '1rem',
        color: unValidated ? 'grey' : 'black',
    }),
    name: {
        fontWeight: 'bold',
    },
    scheme: {
        fontWeight: 'bold',
        fontSize: '0.75em',
        color: 'grey',
    },
};

const PropertyComponent = ({ name, value, scheme, contributors, unValidatedFields }) => (
    <dl className="property" style={styles.container(unValidatedFields.includes(name))}>
        <dt>
            <div className="property_name" style={styles.name}>{name}</div>
            <div className="property_scheme" style={styles.scheme}>{scheme}</div>
            { contributors[name] ?
                <div className="property_contributor" style={styles.scheme}>{contributors[name]}</div>
            :
                null
            }
        </dt>
        <dd>{value}</dd>
    </dl>
);

PropertyComponent.propTypes = propertyPropTypes;

const mapStateToProps = state => ({
    unValidatedFields: getResourceUnvalidatedFields(state),
    contributors: getResourceContributorsByField(state),
});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PropertyComponent);
