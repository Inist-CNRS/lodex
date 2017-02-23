import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';

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

const PropertyComponent = ({
    className,
    field,
    linkedFields,
    fields,
    resource,
    contributors,
    unValidatedFields,
    p: polyglot,
}) => (
    <dl
        className={classnames('property', className)}
        style={styles.container(unValidatedFields.includes(resource.name))}
    >
        <dt>
            <div className="property_name" style={styles.name}>{field.label}</div>
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
            {linkedFields.map(linkedField => (
                <Property
                    key={linkedField._id}
                    className="complete"
                    field={linkedField}
                    resource={resource}
                />
            ))}
        </dd>
    </dl>
);

PropertyComponent.propTypes = {
    className: PropTypes.string,
    contributors: PropTypes.objectOf(contributorPropTypes).isRequired,
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    linkedFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    p: polyglotPropTypes.isRequired,
    resource: PropTypes.shape({}).isRequired,
    unValidatedFields: PropTypes.arrayOf(PropTypes.string).isRequired,
};

PropertyComponent.defaultProps = {
    className: null,
};

const mapStateToProps = (state, { field }) => ({
    unValidatedFields: fromResource.getResourceUnvalidatedFields(state),
    contributors: fromResource.getResourceContributorsByField(state),
    fields: fromPublication.getCollectionFields(state),
    linkedFields: fromPublication.getLinkedFields(state, field),
});

const Property = compose(
    translate,
    connect(mapStateToProps),
)(PropertyComponent);

export default Property;
