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

const PropertyLinkedFieldsComponent = ({
    fieldName,
    linkedFields,
    resource,
}) => {
    if (!linkedFields.length) {
        return null;
    }
    return (
        <div
            className="linked_fields"
        >
            {linkedFields.map(linkedField => (
                <Property
                    key={linkedField._id}
                    className={classnames('completes', `completes_${fieldName}`)}
                    field={linkedField}
                    resource={resource}
                />
            ))}
        </div>
    );
};

PropertyLinkedFieldsComponent.propTypes = {
    fieldName: PropTypes.string.isRequired,
    linkedFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
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
