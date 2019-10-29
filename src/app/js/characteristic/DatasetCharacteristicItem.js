import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Property from '../public/Property';
import { fromFields, fromCharacteristic } from '../sharedSelectors';
import { field as fieldPropTypes } from '../propTypes';

export const DatasetCharacteristicItemComponent = ({
    resource,
    field,
    style,
}) => <Property resource={resource} field={field} style={style} />;

DatasetCharacteristicItemComponent.propTypes = {
    resource: PropTypes.shape({
        uri: PropTypes.string.isRequired,
    }).isRequired,
    field: fieldPropTypes.isRequired,
    style: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state, { characteristic: { name } }) => ({
    field: fromFields.getFieldByName(state, name),
    resource: {
        name,
        ...fromCharacteristic.getCharacteristicsAsResource(state),
    },
});

export default connect(mapStateToProps)(DatasetCharacteristicItemComponent);
