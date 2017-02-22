import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import {
    fromResource,
    fromPublication,
} from './selectors';
import {
    contributor as contributorPropTypes,
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../propTypes';
import Format from './Format';

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

const PropertyComponent = ({ field, fields, resource, contributors, unValidatedFields, p: polyglot }) => (
    <dl className="property" style={styles.container(unValidatedFields.includes(resource.name))}>
        <dt>
            <div className="property_name" style={styles.name}>{field.name}</div>
            <div className="property_scheme" style={styles.scheme}>{field.scheme}</div>
            { contributors[field.name] ?
                <div className="property_contributor" style={styles.scheme}>
                    {polyglot.t('contributed_by', { name: contributors[field.name] })}
                </div>
            :
                null
            }
        </dt>
        <dd>
            <Format
                field={field}
                fields={fields}
                resource={resource}
            />
        </dd>
    </dl>
);

PropertyComponent.propTypes = {
    contributors: PropTypes.objectOf(contributorPropTypes).isRequired,
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    p: polyglotPropTypes.isRequired,
    resource: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
    unValidatedFields: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = state => ({
    unValidatedFields: fromResource.getResourceUnvalidatedFields(state),
    contributors: fromResource.getResourceContributorsByField(state),
    fields: fromPublication.getCollectionFields(state),
});

export default compose(
    translate,
    connect(mapStateToProps),
)(PropertyComponent);
