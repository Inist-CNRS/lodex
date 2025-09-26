import React from 'react';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { Box, TextField } from '@mui/material';
import { translate } from '../../i18n/I18NContext';

const SourceValueArbitrary = ({
    // @ts-expect-error TS7031
    updateDefaultValueTransformers,
    // @ts-expect-error TS7031
    value,
    // @ts-expect-error TS7031
    p: polyglot,
}) => {
    const [valueInput, setValueInput] = React.useState(value || '');
    // @ts-expect-error TS7006
    const handleChange = (event) => {
        setValueInput(event.target.value);
        const transformers = [
            {
                operation: 'VALUE',
                args: [
                    {
                        name: 'value',
                        type: 'string',
                        value: event.target.value,
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
                placeholder={polyglot.t('enter_an_arbitrary_value')}
                label={polyglot.t('arbitrary_value')}
                onChange={handleChange}
                value={valueInput}
                multiline
            />
        </Box>
    );
};

SourceValueArbitrary.propTypes = {
    p: polyglotPropTypes.isRequired,
    updateDefaultValueTransformers: PropTypes.func.isRequired,
    value: PropTypes.string,
};

export default compose(translate)(SourceValueArbitrary);
