import React, { useEffect } from 'react';
import compose from 'recompose/compose';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PropTypes from 'prop-types';
import RoutineCatalog from '../wizard/RoutineCatalog';
import translate from 'redux-polyglot/translate';
import { connect } from 'react-redux';
import { fromParsing } from '../../admin/selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { Autocomplete, Box, Button, TextField } from '@mui/material';

const SourceValuePrecomputed = ({
    precomputedData,
    updateDefaultValueTransformers,
    value,
    routine,
    p: polyglot,
}) => {
    console.log('-------- SourceValuePrecomputed ---------');
    console.log(value);
    const [autocompleteValue, setAutocompleteValue] = React.useState(value);
    useEffect(() => {
        setAutocompleteValue(value);
    }, [value]);
    const [openRoutineCatalog, setOpenRoutineCatalog] = React.useState(false);
    const [valueInput, setValueInput] = React.useState(routine);
    const handleChangePrecomputed = event => {
        setAutocompleteValue(event.target.value);
        const transformers = [
            {
                operation: 'PRECOMPUTED',
                args: [
                    {
                        name: 'precomputed',
                        type: 'string',
                        value: event.target.value,
                    },
                    {
                        name: 'routine',
                        type: 'string',
                        value: routine,
                    },
                ],
            },
        ];

        updateDefaultValueTransformers(transformers);
    };

    const handleChangeRoutine = event => {
        setValueInput(event.target.value);
        const transformers = [
            {
                operation: 'PRECOMPUTED',
                args: [
                    {
                        name: 'precomputed',
                        type: 'string',
                        value: value,
                    },
                    {
                        name: 'routine',
                        type: 'string',
                        value: event.target.value,
                    },
                ],
            },
        ];

        updateDefaultValueTransformers(transformers);
    };

    return (
        <Box mt={5} display="flex" flexDirection="column" gap={2}>
            <Autocomplete
                data-testid="source-value-from-precomputed"
                fullWidth
                options={precomputedData}
                value={autocompleteValue ?? ''}
                renderInput={params => (
                    <TextField
                        {...params}
                        label={polyglot.t('from_precomputed')}
                        placeholder={polyglot.t('enter_from_precomputed')}
                    />
                )}
                onChange={handleChangePrecomputed}
            />
            <Box display="flex" alignItems="center">
                <TextField
                    fullWidth
                    placeholder={polyglot.t('enter_a_routine_value')}
                    label={polyglot.t('routine_value')}
                    onChange={handleChangeRoutine}
                    value={valueInput}
                />
                <Box style={{ marginLeft: '10px', height: '56px' }}>
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
                    onChange={handleChangeRoutine}
                    currentValue={value}
                />{' '}
            </Box>
        </Box>
    );
};

const mapStateToProps = state => ({
    precomputedData: fromParsing
        .getParsedPrecomputedList(state)
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())),
});

SourceValuePrecomputed.propTypes = {
    precomputedData: PropTypes.arrayOf(PropTypes.string).isRequired,
    p: polyglotPropTypes.isRequired,
    updateDefaultValueTransformers: PropTypes.func.isRequired,
    value: PropTypes.string,
    routine: PropTypes.string,
};

export default compose(
    connect(mapStateToProps),
    translate,
)(SourceValuePrecomputed);
