import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';

const EJSEditor = ({ value, onChange }) => {
    const FormSourceCodeField =
        require('../../../lib/components/FormSourceCodeField').default;

    const [currentValue, setCurrentValue] = useState(value || '');

    useEffect(() => {
        onChange(currentValue);
    }, [currentValue]);

    const handleChange = (newValue) => {
        setCurrentValue(newValue);
    };

    return (
        <Box width="100%">
            <FormSourceCodeField
                style={{
                    width: '100%',
                    height: '70vh',
                    borderRadius: '5px',
                }}
                mode="ejs"
                input={{
                    value: currentValue,
                    onChange: handleChange,
                }}
            />
        </Box>
    );
};

EJSEditor.propTypes = {
    p: polyglotPropTypes.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default translate(EJSEditor);
