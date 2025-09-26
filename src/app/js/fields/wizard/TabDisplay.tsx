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
    // @ts-expect-error TS7031
    filter,
    // @ts-expect-error TS7031
    fields,
    // @ts-expect-error TS7031
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
            // @ts-expect-error TS2322
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
