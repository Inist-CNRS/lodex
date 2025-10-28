import React, { useEffect } from 'react';
import ListAltIcon from '@mui/icons-material/ListAlt';
import RoutineCatalog from '../wizard/RoutineCatalog';
import { useSelector } from 'react-redux';
import { fromPrecomputed } from '../../../../../packages/admin-app/src/selectors';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import RoutineCatalogAutocomplete from '../wizard/RoutineCatalogAutocomplete';
import type { State } from '../../../../../packages/admin-app/src/reducers';
import { useTranslate } from '../../i18n/I18NContext';
import type { TransformerDraft } from '../types.ts';

const SourceValuePrecomputed = ({
    updateDefaultValueTransformers,
    value,
    routine,
}: {
    updateDefaultValueTransformers: (transformers: TransformerDraft[]) => void;
    value?: string | null;
    routine?: string;
}) => {
    const { translate } = useTranslate();
    const precomputedData = useSelector((state: State) =>
        fromPrecomputed
            .precomputed(state)
            .sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
            ),
    );
    const [autocompleteValue, setAutocompleteValue] = React.useState(value);
    useEffect(() => {
        setAutocompleteValue(value);
    }, [value]);
    const [openRoutineCatalog, setOpenRoutineCatalog] = React.useState(false);
    const [valueInput, setValueInput] = React.useState(routine || '');

    // @ts-expect-error TS7006
    const handleChangePrecomputed = (event, value) => {
        const precomputedSelected = precomputedData.find((precomputed) => {
            return precomputed.name === value;
        });

        if (
            !precomputedSelected?.hasData ||
            precomputedSelected?.status !== 'FINISHED'
        ) {
            toast.warning(translate('error_precomputed_data_empty'));
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

    // @ts-expect-error TS7006
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
                        label={translate('from_precomputed')}
                        placeholder={translate('enter_from_precomputed')}
                    />
                )}
                onChange={handleChangePrecomputed}
            />

            <Box display="flex" alignItems="center">
                <RoutineCatalogAutocomplete
                    // @ts-expect-error TS2322
                    onChange={handleChangeRoutine}
                    currentValue={valueInput}
                    label={translate('enter_a_routine_value')}
                    precomputed
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
                    // @ts-expect-error TS2322
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

export default SourceValuePrecomputed;
