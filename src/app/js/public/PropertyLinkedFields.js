import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';

import {
    fromPublication,
} from './selectors';
import {
    field as fieldPropTypes,
} from '../propTypes';
import { changeFieldStatus } from './resource';
import Property from './Property';

const styles = {
    container: {
        paddingLeft: '2rem',
        marginLeft: '2rem',
        borderLeft: '5px dotted rgb(224, 224, 224)',
    },
};

const PropertyLinkedFieldsComponent = ({
    fieldName,
    isSaving,
    onSaveProperty,
    linkedFields,
    resource,
}) => {
    if (!linkedFields.length) {
        return null;
    }
    return (
        <div
            className="linked_fields"
            style={styles.container}
        >
            {linkedFields.map(linkedField => (
                <Property
                    key={linkedField._id}
                    className={classnames('completes', `completes_${fieldName}`)}
                    field={linkedField}
                    isSaving={isSaving}
                    resource={resource}
                    onSaveProperty={onSaveProperty}
                />
            ))}
        </div>
    );
};

PropertyLinkedFieldsComponent.propTypes = {
    fieldName: PropTypes.string.isRequired,
    isSaving: PropTypes.bool.isRequired,
    linkedFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    onSaveProperty: PropTypes.func.isRequired,
    resource: PropTypes.shape({}).isRequired,
};

PropertyLinkedFieldsComponent.defaultProps = {
    fieldStatus: null,
};

const mapStateToProps = (state, { fieldName }) => ({
    linkedFields: fromPublication.getLinkedFields(state, fieldName),
});

const mapDispatchToProps = (dispatch, { field, resource: { uri } }) => bindActionCreators({
    changeStatus: (prevStatus, status) => changeFieldStatus({
        uri,
        field: field.name,
        status,
        prevStatus,
    }),
}, dispatch);

const PropertyLinkedFields = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PropertyLinkedFieldsComponent);

export default PropertyLinkedFields;
