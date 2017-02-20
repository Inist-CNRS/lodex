import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Property from '../Property';
import { fromPublication } from '../../selectors';
import { field as fieldPropTypes } from '../../propTypes';

const DatasetCharacteristicItemComponent = ({ resource, field }) => (
    <Property resource={resource} field={field} />
);

DatasetCharacteristicItemComponent.propTypes = {
    resource: PropTypes.shape({}).isRequired,
    field: fieldPropTypes.isRequired,
};

const mapStateToProps = (state, { characteristic: { name, scheme, value } }) => ({
    field: fromPublication.getFieldByName(state, name),
    resource: { name, scheme, [name]: value },
});

export default connect(mapStateToProps)(DatasetCharacteristicItemComponent);
