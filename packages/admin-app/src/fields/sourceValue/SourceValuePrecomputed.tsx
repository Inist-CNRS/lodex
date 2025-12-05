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
    const [selectedPrecomputation, setSelectedPrecomputation] = useState(value);
    const [selectedPrecomputedColumn, setSelectedPrecomputedColumn] = useState<
        string | null
    >(null);
    useEffect(() => {
        setSelectedPrecomputation(value);
    }, [value]);
    const [openRoutineCatalog, setOpenRoutineCatalog] = useState(false);
    const [valueInput, setValueInput] = useState(routine || '');

    const precomputedId = useMemo(() => {
        const precomputed = precomputedData.find((pc) => pc.name === value);
        return precomputed?._id;
    }, [precomputedData, value]);

    const { precomputedFieldNames, isLoadingPrecomputedColumns } =
        useGetPreComputedColumns({
            precomputedId,
        });

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
        setSelectedPrecomputedColumn(null);
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
                        value: routine!,
                    },
                ],
            },
        ];

        updateDefaultValueTransformers(transformers);
    };

    const handleChangePrecomputedColumns = (
        _event: unknown,
        column: string | null,
    ) => {
        setSelectedPrecomputedColumn(column);
        const transformers = [
            {
                operation: 'PRECOMPUTED',
                args: [
                    {
                        name: 'precomputed',
                        type: 'string',
                        value: value!,
                    },
                    {
                        name: 'routine',
                        type: 'string',
                        value: routine!,
                    },
                ],
            },
            column
                ? {
                      operation: 'COLUMN',
                      args: [
                          {
                              name: 'column',
                              type: 'column',
                              value: column,
                          },
                      ],
                  }
                : null,
        ].filter(Boolean) as TransformerDraft[];

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
            selectedPrecomputedColumn
                ? {
                      operation: 'COLUMN',
                      args: [
                          {
                              name: 'column',
                              type: 'column',
                              value: selectedPrecomputedColumn,
                          },
                      ],
                  }
                : null,
        ].filter(Boolean) as TransformerDraft[];

        updateDefaultValueTransformers(transformers);
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
            <Autocomplete
                data-testid="source-value-from-precomputed-column"
                fullWidth
                disabled={!selectedPrecomputation}
                loading={isLoadingPrecomputedColumns}
                options={precomputedFieldNames}
                value={selectedPrecomputedColumn}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={translate('from_precomputed_column')}
                        placeholder={translate('enter_precomputed_from_column')}
                    />
                )}
                onChange={handleChangePrecomputedColumns}
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
