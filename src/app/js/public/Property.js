import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
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
import getFieldClassName from '../lib/getFieldClassName';
import Format from './Format';

const styles = {
    container: memoize(style => Object.assign({
        display: 'flex',
        flexDirection: 'column',
    }, style)),
    label: memoize(status => Object.assign({
        color: grey500,
        flexGrow: 2,
        fontWeight: 'bold',
        fontSize: '1rem',
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
    editButton: {
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
    value: {
        flexGrow: 2,
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
    parents,
}) => {
    if (!loggedIn && fieldStatus === REJECTED) {
        return null;
    }
    const fieldClassName = getFieldClassName(field);
    return (
        <div
            className={classnames('property', fieldClassName, className)}
            style={styles.container(style, fieldStatus)}
        >
            <div>
                <div style={styles.labelContainer}>
                    <span className={classnames('property_label', fieldClassName)} style={styles.label(fieldStatus)}>
                        {field.label}
                    </span>

                    <span className={classnames('property_scheme', fieldClassName)} style={styles.scheme}>
                        {field.scheme}
                    </span>
                </div>
                <PropertyContributor fieldName={field.name} fieldStatus={fieldStatus} />
            </div>
            <div style={styles.valueContainer}>
                {field.language &&
                    <span className={classnames('property_language', fieldClassName)} style={styles.language}>
                        {field.language}
                    </span>
                }

                <div style={styles.value}>
                    <Format
                        className={classnames('property_value', fieldClassName)}
                        field={field}
                        resource={resource}
                        fieldStatus={fieldStatus}
                    />
                </div>

                <EditField
                    field={field}
                    isSaving={isSaving}
                    resource={resource}
                    onSaveProperty={onSaveProperty}
                />
            </div>
            <CompositeProperty
                field={field}
                isSaving={isSaving}
                resource={resource}
                onSaveProperty={onSaveProperty}
                parents={parents}
            />

            <PropertyLinkedFields
                fieldName={field.name}
                isSaving={isSaving}
                resource={resource}
                onSaveProperty={onSaveProperty}
                parents={parents}
            />
            <ModerateButton
                fieldName={field.name}
                status={fieldStatus}
                changeStatus={changeStatus}
            />
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
    parents: PropTypes.arrayOf(PropTypes.string).isRequired,
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

const Property = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withProps(({ field, parents = [] }) => ({ parents: [field.name, ...parents] })),
)(PropertyComponent);

export default Property;
