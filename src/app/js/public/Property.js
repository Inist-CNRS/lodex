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
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../propTypes';
import Format from './Format';
import CompositeProperty from './CompositeProperty';
import { languages } from '../../../../config.json';

const styles = {
    container: unValidated => ({
        display: 'flex',
        marginRight: '1rem',
        color: unValidated ? 'grey' : 'black',
    }),
    name: {
        fontWeight: 'bold',
    },
    language: {
        marginLeft: '0.5rem',
        fontSize: '0.75em',
        color: 'grey',
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
    compositeFields,
    fields,
    resource,
    contributors,
    unValidatedFields,
    p: polyglot,
}) => (
    <div
        className={classnames('property', field.label.toLowerCase().replace(/\s/g, '_'), className)}
    >
        <dl style={styles.container(unValidatedFields.includes(resource.name))}>
            <dt>
                <div>
                    <span className="property_name" style={styles.name}>{field.label}</span>
                    {field.language &&
                        <span className="property_language" style={styles.language}>
                            ({languages.find(f => f.code === field.language).label})
                        </span>
                    }
                </div>
                { contributors[field.name] ?
                    <div className="property_contributor" style={styles.scheme}>
                        {polyglot.t('contributed_by', { name: contributors[field.name] })}
                    </div>
                :
                    null
                }
            </dt>
            <dd>
                { compositeFields.length > 0 ?
                    <CompositeProperty field={field} resource={resource} />
                :
                    <Format
                        className="property_value"
                        field={field}
                        fields={fields}
                        resource={resource}
                    />
                }
                {linkedFields.map(linkedField => (
                    <Property
                        key={linkedField._id}
                        className={classnames('completes', `completes_${field.name}`)}
                        field={linkedField}
                        resource={resource}
                    />
                ))}
            </dd>
        </dl>
        <div className="property_scheme" style={styles.scheme}>{field.scheme}</div>
    </div>
);

PropertyComponent.propTypes = {
    className: PropTypes.string,
    contributors: PropTypes.objectOf(PropTypes.string).isRequired,
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    linkedFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    compositeFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    p: polyglotPropTypes.isRequired,
    resource: PropTypes.shape({}).isRequired,
    unValidatedFields: PropTypes.arrayOf(PropTypes.string).isRequired,
};

PropertyComponent.defaultProps = {
    className: null,
};

const mapStateToProps = (state, { field }) => ({
    unValidatedFields: fromResource.getResourceProposededFields(state),
    contributors: fromResource.getResourceContributorsByField(state),
    fields: fromPublication.getCollectionFields(state),
    linkedFields: fromPublication.getLinkedFields(state, field),
    compositeFields: fromPublication.getCompositeFieldsByField(state, field),
});

const Property = compose(
    translate,
    connect(mapStateToProps),
)(PropertyComponent);

export default Property;
