import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Property from '../Property';
import { fromCharacteristic } from '../selectors';
import { fromFields } from '../../sharedSelectors';
import { field as fieldPropTypes } from '../../propTypes';

const DatasetCharacteristicItemComponent = ({
    resource,
    field,
    isSaving,
    style,
}) => (
    <Property
        resource={resource}
        field={field}
        isSaving={isSaving}
        style={style}
    />
);

DatasetCharacteristicItemComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    isSaving: PropTypes.bool.isRequired,
    resource: PropTypes.shape({}).isRequired,
    style: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state, { characteristic: { name } }) => ({
    field: fromFields.getFieldByName(state, name),
    resource: {
        name,
        ...fromCharacteristic.getCharacteristicsAsResource(state),
    },
    isSaving: fromCharacteristic.isSaving(state),
});

export default connect(mapStateToProps)(DatasetCharacteristicItemComponent);
