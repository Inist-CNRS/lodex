import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';

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
import propositionStatus, { PROPOSED, VALIDATED, REJECTED } from '../../../common/propositionStatus';
import ModerateButton from './ModerateButton';
import { changeFieldStatus } from './resource';

const styles = {
    container: status => ({
        display: 'flex',
        marginRight: '1rem',
        color: (status && status !== VALIDATED) ? 'grey' : 'black',
        textDecoration: status === REJECTED ? 'line-through' : 'none',
    }),
    name: {
        fontWeight: 'bold',
        marginRight: '1rem',
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
    fieldStatus,
    changeStatus,
    p: polyglot,
}) => (
    <div
        className={classnames('property', field.label.toLowerCase().replace(/\s/g, '_'), className)}
    >
        <dl style={styles.container(fieldStatus)}>
            <dt>
                <div>
                    <span className="property_name" style={styles.name}>{field.label}</span>
                    {field.language &&
                        <span className="property_language" style={styles.language}>
                            ({languages.find(f => f.code === field.language).label})
                        </span>
                    }
                    { contributors[field.name] ?
                        <div className="property_contributor" style={styles.scheme}>
                            {
                            fieldStatus === PROPOSED ?
                                polyglot.t('contributed_by', { name: contributors[field.name] })
                            :
                                polyglot.t('added_by', { name: contributors[field.name] })
                            }
                        </div>
                    :
                        null
                    }
                </div>
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
            {
                fieldStatus ?
                    <ModerateButton status={fieldStatus} changeStatus={changeStatus} />
                : null
            }
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
    fieldStatus: PropTypes.oneOf(propositionStatus),
    changeStatus: PropTypes.func.isRequired,
};

PropertyComponent.defaultProps = {
    className: null,
    fieldStatus: null,
};

const mapStateToProps = (state, { field }) => ({
    contributors: fromResource.getResourceContributorsByField(state),
    fields: fromPublication.getCollectionFields(state),
    linkedFields: fromPublication.getLinkedFields(state, field),
    compositeFields: fromPublication.getCompositeFieldsByField(state, field),
    fieldStatus: fromResource.getFieldStatus(state, field),
});

const mapDispatchToProps = (dispatch, { field }) => bindActionCreators({
    changeStatus: (prevStatus, status) => changeFieldStatus({
        field: field.name,
        status,
        prevStatus,
    }),
}, dispatch);

const Property = compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(PropertyComponent);

export default Property;
