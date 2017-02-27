import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Property from '../Property';
import {
    fromCharacteristic,
    fromPublication,
} from '../selectors';
import { field as fieldPropTypes } from '../../propTypes';

const DatasetCharacteristicItemComponent = ({ resource, field }) => (
    <Property resource={resource} field={field} />
);

DatasetCharacteristicItemComponent.propTypes = {
    resource: PropTypes.shape({}).isRequired,
    field: fieldPropTypes.isRequired,
};

const mapStateToProps = (state, { characteristic: { name } }) => ({
    field: fromPublication.getFieldByName(state, name),
    resource: { name, ...fromCharacteristic.getCharacteristicsAsResource(state) },
});

export default connect(mapStateToProps)(DatasetCharacteristicItemComponent);
