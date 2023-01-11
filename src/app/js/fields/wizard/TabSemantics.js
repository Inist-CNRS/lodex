import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import { field as fieldPropTypes } from '../../propTypes';
import FieldComposedOf from '../FieldComposedOf';
import FieldAnnotation from '../FieldAnnotation';
import FieldSchemeInput from '../FieldSchemeInput';

export const TabSemanticsComponent = ({ fields }) => {
    const { filter } = useParams();
    return (
        <>
            <FieldSchemeInput />
            <FieldAnnotation fields={fields} scope={filter} />
            <FieldComposedOf fields={fields} />
        </>
    );
};

TabSemanticsComponent.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
};

export default TabSemanticsComponent;
