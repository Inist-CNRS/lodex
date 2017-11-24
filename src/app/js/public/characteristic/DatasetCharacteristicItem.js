import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Property from '../Property';
import { fromCharacteristic } from '../selectors';
import { fromFields } from '../../sharedSelectors';
import { field as fieldPropTypes } from '../../propTypes';

import { updateCharacteristics as updateCharacteristicsAction } from './';

const DatasetCharacteristicItemComponent = ({
    resource,
    field,
    handleSaveProperty,
    isSaving,
    style,
}) => (
    <Property
        resource={resource}
        field={field}
        isSaving={isSaving}
        onSaveProperty={handleSaveProperty}
        style={style}
    />
);

DatasetCharacteristicItemComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    isSaving: PropTypes.bool.isRequired,
    handleSaveProperty: PropTypes.func.isRequired,
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

const mapDispatchToProps = {
    handleSaveProperty: updateCharacteristicsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(
    DatasetCharacteristicItemComponent,
);
