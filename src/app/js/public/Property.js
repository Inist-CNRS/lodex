import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { grey500 } from 'material-ui/styles/colors';
import memoize from 'lodash.memoize';

import { fromResource } from './selectors';
import { field as fieldPropTypes } from '../propTypes';
import CompositeProperty from './CompositeProperty';
import propositionStatus, { REJECTED } from '../../../common/propositionStatus';
import ModerateButton from './ModerateButton';
import { changeFieldStatus } from './resource';
import PropertyContributor from './PropertyContributor';
import PropertyLinkedFields from './PropertyLinkedFields';
import { isLoggedIn } from '../user';
import EditField from './EditField';

const styles = {
    container: memoize(style => Object.assign({
        display: 'flex',
        flexDirection: 'column',
    }, style)),
    label: memoize(status => Object.assign({
        color: grey500,
        flexGrow: 2,
        fontWeight: 'bold',
        textDecoration: status === REJECTED ? 'line-through' : 'none',
    })),
    language: {
        marginRight: '1rem',
        fontSize: '0.75em',
        color: 'grey',
        textTransform: 'uppercase',
    },
    scheme: {
        fontWeight: 'bold',
        fontSize: '0.75em',
        color: 'grey',
        alignSelf: 'flex-end',
    },
    labelContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    valueContainer: {
        display: 'flex',
        alignItems: 'center',
    },
};

const PropertyComponent = ({
    className,
    field,
    isSaving,
    resource,
    fieldStatus,
    loggedIn,
    changeStatus,
    onSaveProperty,
    style,
}) => {
    if (!loggedIn && fieldStatus === REJECTED) {
        return null;
    }

    return (
        <div
            className={classnames('property', field.label.toLowerCase().replace(/\s/g, '_'), className)}
            style={styles.container(style, fieldStatus)}
        >
            <div>
                <div style={styles.labelContainer}>
                    <span className="property_label" style={styles.label(fieldStatus)}>{field.label}</span>

                    <EditField
                        field={field}
                        isSaving={isSaving}
                        resource={resource}
                        onSaveProperty={onSaveProperty}
                    />
                </div>
                <PropertyContributor fieldName={field.name} fieldStatus={fieldStatus} />
            </div>
            <div style={styles.valueContainer}>
                {field.language &&
                    <span className="property_language" style={styles.language}>
                        {field.language}
                    </span>
                }

                <CompositeProperty
                    field={field}
                    isSaving={isSaving}
                    resource={resource}
                    onSaveProperty={onSaveProperty}
                />
            </div>
            <div className="property_scheme" style={styles.scheme}>{field.scheme}</div>
            <PropertyLinkedFields
                fieldName={field.name}
                isSaving={isSaving}
                resource={resource}
                onSaveProperty={onSaveProperty}
            />
            <ModerateButton status={fieldStatus} changeStatus={changeStatus} />
        </div>
    );
};

PropertyComponent.propTypes = {
    changeStatus: PropTypes.func.isRequired,
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    fieldStatus: PropTypes.oneOf(propositionStatus),
    isSaving: PropTypes.bool.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    onSaveProperty: PropTypes.func.isRequired,
    resource: PropTypes.shape({}).isRequired,
    style: PropTypes.object, // eslint-disable-line
};

PropertyComponent.defaultProps = {
    className: null,
    fieldStatus: null,
};

const mapStateToProps = (state, { field }) => ({
    loggedIn: isLoggedIn(state),
    fieldStatus: fromResource.getFieldStatus(state, field),
});

const mapDispatchToProps = (dispatch, { field, resource: { uri } }) => bindActionCreators({
    changeStatus: (prevStatus, status) => changeFieldStatus({
        uri,
        field: field.name,
        status,
        prevStatus,
    }),
}, dispatch);

const Property = connect(mapStateToProps, mapDispatchToProps)(PropertyComponent);

export default Property;
