import React, { useEffect } from 'react';
import compose from 'recompose/compose';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PropTypes from 'prop-types';
import RoutineCatalog from '../wizard/RoutineCatalog';
import translate from 'redux-polyglot/translate';
import { connect } from 'react-redux';
import { fromPrecomputed } from '../../admin/selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import { toast } from 'react-toastify';

const SourceValuePrecomputed = ({
    precomputedData,
    updateDefaultValueTransformers,
    value,
    routine,
    p: polyglot,
}) => {
    const [autocompleteValue, setAutocompleteValue] = React.useState(value);
    useEffect(() => {
        setAutocompleteValue(value);
    }, [value]);
    const [openRoutineCatalog, setOpenRoutineCatalog] = React.useState(false);
    const [valueInput, setValueInput] = React.useState(routine || '');

    const handleChangePrecomputed = (event, value) => {
        const precomputedSelected = precomputedData.find((precomputed) => {
            return precomputed.name === value;
        });

        if (
            !precomputedSelected.hasData ||
            precomputedSelected.status !== 'FINISHED'
        ) {
            toast.warning(polyglot.t('error_precomputed_data_empty'));
        }

        setAutocompleteValue(value);
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
                        value: routine,
                    },
                ],
            },
        ];

        updateDefaultValueTransformers(transformers);
    };

    const handleChangeRoutine = (event) => {
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
                options={precomputedData.map(({ name }) => name)}
                value={autocompleteValue ?? ''}
                renderInput={(params) => (
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
                    currentValue={routine}
                    precomputed
                />
            </Box>
        </Box>
    );
};

const mapStateToProps = (state) => ({
    precomputedData: fromPrecomputed
        .precomputed(state)
        .sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        ),
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
