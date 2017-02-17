import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import {
    getResourceUnvalidatedFields,
    getResourceContributorsByField,
} from '../resource';
import {
    contributor as contributorPropTypes,
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
    resource as resourcePropTypes,
} from '../propTypes';
import { getCollectionFields } from '../publication';
import Format from '../formats/Format';

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
    contributors: PropTypes.arrayOf(contributorPropTypes).isRequired,
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    p: polyglotPropTypes.isRequired,
    resource: resourcePropTypes.isRequired,
    unValidatedFields: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = state => ({
    unValidatedFields: getResourceUnvalidatedFields(state),
    contributors: getResourceContributorsByField(state),
    fields: getCollectionFields(state),
});

export default compose(
    translate,
    connect(mapStateToProps),
)(PropertyComponent);
