import React from 'react';
import compose from 'recompose/compose';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PropTypes from 'prop-types';
import RoutineCatalog from '../wizard/RoutineCatalog';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { Box, Button, TextField } from '@mui/material';

const SourceValueArbitrary = ({ updateTransformers, value, p: polyglot }) => {
    const [openRoutineCatalog, setOpenRoutineCatalog] = React.useState(false);
    const handleChange = event => {
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

        updateTransformers(transformers);
    };

    return (
        <Box mt={5} display="flex">
            <TextField
                fullWidth
                placeholder={polyglot.t('enter_an_arbitrary_value')}
                label={polyglot.t('arbitrary_value')}
                onChange={handleChange}
                value={value || ''}
                multiline
            />
            <Box style={{ marginLeft: '10px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenRoutineCatalog(true)}
                    sx={{ height: '100%' }}
                >
                    <ListAltIcon fontSize="medium" />
                </Button>
            </Box>
            <RoutineCatalog
                isOpen={openRoutineCatalog}
                handleClose={() => setOpenRoutineCatalog(false)}
                onChange={handleChange}
                currentValue={value}
            />
        </Box>
    );
};

SourceValueArbitrary.propTypes = {
    p: polyglotPropTypes.isRequired,
    updateTransformers: PropTypes.func.isRequired,
    value: PropTypes.string,
};

export default compose(translate)(SourceValueArbitrary);
