import React from 'react';
import PropTypes from 'prop-types';

import FieldFormatInput from '../FieldFormatInput';
import FieldOverviewInput from '../FieldOverviewInput';
import FieldDisplayInput from '../FieldDisplay';
import FieldWidthInput from '../FieldWidthInput';
import { SCOPE_DATASET } from '../../../../common/scope';

export const TabDisplayComponent = ({
    keepMeta = true,
    isSubresourceField = false,
    filter,
}) => (
    <>
        {keepMeta && <FieldDisplayInput />}
        {keepMeta && filter !== SCOPE_DATASET && (
            <FieldOverviewInput isSubresourceField={isSubresourceField} />
        )}
        <FieldFormatInput />
        <FieldWidthInput />
    </>
);

TabDisplayComponent.propTypes = {
    keepMeta: PropTypes.bool,
    isSubresourceField: PropTypes.bool,
    filter: PropTypes.string.isRequired,
};

export default TabDisplayComponent;
