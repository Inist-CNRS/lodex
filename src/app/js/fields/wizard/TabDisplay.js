import React from 'react';
import PropTypes from 'prop-types';

import FieldFormatInput from '../FieldFormatInput';
import FieldOverviewInput from '../FieldOverviewInput';
import FieldDisplayInput from '../FieldDisplay';
import FieldWidthInput from '../FieldWidthInput';

export const TabDisplayComponent = ({
    keepMeta = true,
    isSubresourceField = false,
}) => (
    <>
        {keepMeta && <FieldDisplayInput />}
        {keepMeta && (
            <FieldOverviewInput isSubresourceField={isSubresourceField} />
        )}
        <FieldFormatInput />
        <FieldWidthInput />
    </>
);

TabDisplayComponent.propTypes = {
    keepMeta: PropTypes.bool,
    isSubresourceField: PropTypes.bool,
};

export default TabDisplayComponent;
