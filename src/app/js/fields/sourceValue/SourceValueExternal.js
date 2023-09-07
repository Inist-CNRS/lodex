import React from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { Box, TextField } from '@mui/material';

const SourceValueExternal = ({
    updateDefaultValueTransformers,
    value,
    p: polyglot,
}) => {
    const [valueInput, setValueInput] = React.useState(value || '');
    const handleChange = event => {
        setValueInput(event.target.value);
        const transformers = [
            {
                operation: 'VALUE',
                args: [
                    {
                        name: 'webservice',
                        type: 'string',
                        status: 'TO_COMPUTE',
                        webservice: event.target.value,
                    },
                ],
            },
        ];

        updateDefaultValueTransformers(transformers);
    };

    return (
        <Box mt={5} display="flex" alignItems="center">
            <TextField
                fullWidth
                placeholder={polyglot.t('enter_an_external_processing_value')}
                label={polyglot.t('external_processing_value')}
                onChange={handleChange}
                value={valueInput}
                multiline
            />
        </Box>
    );
};

SourceValueExternal.propTypes = {
    p: polyglotPropTypes.isRequired,
    updateDefaultValueTransformers: PropTypes.func.isRequired,
    value: PropTypes.string,
};

export default compose(translate)(SourceValueExternal);
