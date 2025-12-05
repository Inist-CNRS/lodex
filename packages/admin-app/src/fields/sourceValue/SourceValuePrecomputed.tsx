import { useEffect, useMemo, useState } from 'react';
import ListAltIcon from '@mui/icons-material/ListAlt';
import RoutineCatalog from '../wizard/RoutineCatalog';
import { useSelector } from 'react-redux';
import { fromPrecomputed } from '../../selectors';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import RoutineCatalogAutocomplete from '../wizard/RoutineCatalogAutocomplete';
import type { State } from '../../reducers';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import type { TransformerDraft } from '@lodex/frontend-common/fields/types';
import { useGetPreComputedColumns } from './useGetPreComputedColumns';

const SourceValuePrecomputed = ({
    updateDefaultValueTransformers,
    value,
    routine: initialRoutine,
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
    const [selectedPrecomputation, setSelectedPrecomputation] = useState(value);
    const [selectedPrecomputedValueColumn, setSelectedPrecomputedValueColumn] =
        useState<string | null>(null);
    const [selectedPrecomputedLabelColumn, setSelectedPrecomputedLabelColumn] =
        useState<string | null>(null);
    useEffect(() => {
        setSelectedPrecomputation(value);
    }, [value]);
    const [openRoutineCatalog, setOpenRoutineCatalog] = useState(false);
    const [routineValue, setRoutineValue] = useState(initialRoutine || '');

    const precomputedId = useMemo(() => {
        const precomputed = precomputedData.find((pc) => pc.name === value);
        return precomputed?._id;
    }, [precomputedData, value]);

    const { precomputedFieldNames, isLoadingPrecomputedColumns } =
        useGetPreComputedColumns({
            precomputedId,
        });

    useEffect(() => {
        const transformers = [
            {
                operation: 'PRECOMPUTED',
                args: [
                    {
                        name: 'precomputed',
                        type: 'string',
                        value: selectedPrecomputation,
                    },
                    {
                        name: 'precomputedLabelColumn',
                        type: 'string',
                        value: selectedPrecomputedLabelColumn,
                    },
                    {
                        name: 'precomputedValueColumn',
                        type: 'string',
                        value: selectedPrecomputedValueColumn,
                    },
                    {
                        name: 'routine',
                        type: 'string',
                        value: routineValue,
                    },
                ],
            },
        ] as TransformerDraft[];
        updateDefaultValueTransformers(transformers);
    }, [
        selectedPrecomputation,
        selectedPrecomputedLabelColumn,
        selectedPrecomputedValueColumn,
        updateDefaultValueTransformers,
        routineValue,
    ]);

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

        setSelectedPrecomputation(value);
        setSelectedPrecomputedValueColumn(null);
        setSelectedPrecomputedLabelColumn(null);
    };

    // @ts-expect-error TS7006
    const handleChangeRoutine = (event) => {
        setRoutineValue(event.target.value);
        const isSourceWeightRoutine = [
            '/api/run/segments-precomputed/',
            '/api/run/segments-precomputed-nofilter/',
        ].includes(event.target.value);
        if (isSourceWeightRoutine) {
            if (precomputedFieldNames.includes('source')) {
                setSelectedPrecomputedLabelColumn('source');
            }
            if (precomputedFieldNames.includes('weight')) {
                setSelectedPrecomputedValueColumn('weight');
            }
            return;
        }
        if (precomputedFieldNames.includes('id')) {
            setSelectedPrecomputedLabelColumn('id');
        }
        if (precomputedFieldNames.includes('value')) {
            setSelectedPrecomputedValueColumn('value');
        }
    };

    const handleChangePrecomputedValueColumn = (
        _event: unknown,
        column: string | null,
    ) => {
        setSelectedPrecomputedValueColumn(column);
    };

    const handleChangePrecomputedLabelColumn = (
        _event: unknown,
        column: string | null,
    ) => {
        setSelectedPrecomputedLabelColumn(column);
    };

    return (
        <Box mt={5} display="flex" flexDirection="column" gap="2rem">
            <Autocomplete
                data-testid="source-value-from-precomputed"
                fullWidth
                options={precomputedData.map(({ name }) => name)}
                value={selectedPrecomputation ?? ''}
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
                    currentValue={routineValue}
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
                    currentValue={routineValue}
                    precomputed
                />
            </Box>
            <Autocomplete
                data-testid="source-value-from-precomputed-label-column"
                fullWidth
                disabled={!selectedPrecomputation}
                loading={isLoadingPrecomputedColumns}
                options={precomputedFieldNames}
                value={selectedPrecomputedLabelColumn}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={translate('from_precomputed_label_column')}
                        placeholder={translate(
                            'enter_precomputed_from_label_column',
                        )}
                    />
                )}
                onChange={handleChangePrecomputedLabelColumn}
            />
            <Autocomplete
                data-testid="source-value-from-precomputed-value-column"
                fullWidth
                disabled={!selectedPrecomputation}
                loading={isLoadingPrecomputedColumns}
                options={precomputedFieldNames}
                value={selectedPrecomputedValueColumn}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={translate('from_precomputed_value_column')}
                        placeholder={translate(
                            'enter_precomputed_from_value_column',
                        )}
                    />
                )}
                onChange={handleChangePrecomputedValueColumn}
            />
        </Box>
    );
};

export default SourceValuePrecomputed;
