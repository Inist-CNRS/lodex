import React from 'react';
import { connect } from 'react-redux';
import Property from '../lib/Property';
import { getFieldByName } from '../publication';
import { field as fieldPropTypes, resource as resourcePropTypes } from '../propTypes';

const DatasetCharacteristicItemComponent = ({ resource, field }) => (
    <Property resource={resource} field={field} />
);

DatasetCharacteristicItemComponent.propTypes = {
    resource: resourcePropTypes.isRequired,
    field: fieldPropTypes.isRequired,
};

const mapStateToProps = (state, { characteristic: { name, scheme, value } }) => ({
    field: getFieldByName(state, name),
    resource: { name, scheme, [name]: value },
});

export default connect(mapStateToProps)(DatasetCharacteristicItemComponent);
