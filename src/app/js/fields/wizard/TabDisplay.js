import PropTypes from 'prop-types';
import React from 'react';

import { field as fieldPropTypes } from '../../propTypes';
import FieldCaption from '../FieldCaption';
import FieldComposedOf from '../FieldComposedOf';
import FieldDisplayInput from '../FieldDisplay';
import FieldFormatInput from '../FieldFormatInput';
import FieldWidthInput from '../FieldWidthInput';

export const TabDisplayComponent = ({
    keepMeta = true,
    filter,
    fields,
    subresourceId,
}) => (
    <>
        {keepMeta && <FieldDisplayInput />}
        <FieldFormatInput />
        <FieldWidthInput />
        <FieldCaption
            fields={fields}
            scope={filter}
            subresourceId={subresourceId}
        />
        <FieldComposedOf
            fields={fields}
            scope={filter}
            subresourceId={subresourceId}
        />
    </>
);

TabDisplayComponent.propTypes = {
    keepMeta: PropTypes.bool,
    filter: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    subresourceId: PropTypes.string,
};

export default TabDisplayComponent;
