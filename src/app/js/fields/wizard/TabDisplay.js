import React from 'react';
import PropTypes from 'prop-types';

import FieldFormatInput from '../FieldFormatInput';
import FieldDisplayInput from '../FieldDisplay';
import FieldWidthInput from '../FieldWidthInput';
import FieldComposedOf from '../FieldComposedOf';
import FieldAnnotation from '../FieldAnnotation';
import { field as fieldPropTypes } from '../../propTypes';

export const TabDisplayComponent = ({ keepMeta = true, filter, fields }) => (
    <>
        {keepMeta && <FieldDisplayInput />}
        <FieldFormatInput />
        <FieldWidthInput />
        <FieldAnnotation fields={fields} scope={filter} />
        <FieldComposedOf fields={fields} />
    </>
);

TabDisplayComponent.propTypes = {
    keepMeta: PropTypes.bool,
    filter: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
};

export default TabDisplayComponent;
