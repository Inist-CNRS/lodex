import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import { field as fieldPropTypes } from '../../propTypes';
import FieldComposedOf from '../FieldComposedOf';
import FieldAnnotation from '../FieldAnnotation';
import FieldSchemeInput from '../FieldSchemeInput';
import FieldLanguageInput from '../FieldLanguageInput';

export const TabSemanticsComponent = ({ fields, field }) => {
    const { filter } = useParams();
    return (
        <>
            <FieldSchemeInput />
            <FieldLanguageInput field={field} />
            <FieldAnnotation fields={fields} scope={filter} />
            <FieldComposedOf fields={fields} />
        </>
    );
};

TabSemanticsComponent.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    field: fieldPropTypes.isRequired,
};

export default TabSemanticsComponent;
