import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Property from '../public/Property';
import { fromFields, fromCharacteristic, fromUser } from '../sharedSelectors';
import { field as fieldPropTypes } from '../propTypes';
import shouldDisplayField from '../fields/shouldDisplayField';

const DatasetCharacteristicItemComponent = ({
    resource,
    isAdmin,
    field,
    style,
}) => {
    const displayCharacteristic =
        isAdmin || shouldDisplayField(resource)(field);

    return displayCharacteristic ? (
        <Property resource={resource} field={field} style={style} />
    ) : null;
};

DatasetCharacteristicItemComponent.propTypes = {
    resource: PropTypes.shape({
        uri: PropTypes.string.isRequired,
    }).isRequired,
    isAdmin: PropTypes.bool.isRequired,
    field: fieldPropTypes.isRequired,
    style: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state, { characteristic: { name } }) => ({
    field: fromFields.getFieldByName(state, name),
    resource: {
        name,
        ...fromCharacteristic.getCharacteristicsAsResource(state),
    },
    isAdmin: fromUser.isAdmin(state),
});

export default connect(mapStateToProps)(DatasetCharacteristicItemComponent);
