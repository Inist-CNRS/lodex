import { useEffect, useMemo, useState } from 'react';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PropTypes from 'prop-types';
import RoutineCatalog from '../wizard/RoutineCatalog';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { fromFields } from '../../sharedSelectors';
import { useSelector } from 'react-redux';
import { getFieldForSpecificScope } from '../../../../common/scope';
import SearchAutocomplete from '../../admin/Search/SearchAutocomplete';
import RoutineCatalogAutocomplete from '../wizard/RoutineCatalogAutocomplete';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { TransformerDraft } from '../types.ts';
import { useTranslate } from '../../i18n/I18NContext.tsx';

const SourceValueRoutine = ({
    updateDefaultValueTransformers,
    value,
}: {
    updateDefaultValueTransformers: (transformers: TransformerDraft[]) => void;
    value?: string | null;
}) => {
    const { translate } = useTranslate();
    const fields = useSelector((state: any) =>
        fromFields
            .getFields(state)
            .sort((a, b) => a.label.localeCompare(b.label)),
    );
    const [openRoutineCatalog, setOpenRoutineCatalog] = useState(false);
    const [routine, setRoutine] = useState('');
    const [routineArgs, setRoutineArgs] = useState([]);
    const [routineFields, setRoutineFields] = useState([null]);
    const [first, setFirst] = useState(true);

    const fieldsResource = useMemo(
        () => getFieldForSpecificScope(fields, 'collection'),
        [fields],
    );

    useEffect(() => {
        if (typeof value === 'string') {
            setRoutine(value.split('/').slice(0, 4).join('/'));
            const args = value.split('/').slice(4);
            // @ts-expect-error TS2345
            setRoutineArgs(args);
            const filteredRoutineFields = args
                .map((arg) => {
                    // @ts-expect-error TS7006
                    return fieldsResource.find((field) => {
                        return field.name === arg;
                    });
                })
                .filter(Boolean);
            if (filteredRoutineFields.length === 0) {
                setRoutineFields([null]);
            } else {
                setRoutineFields(filteredRoutineFields);
            }
        }
    }, [value]);

    useEffect(() => {
        if (!first) {
            const finalRoutine = [routine, ...routineArgs].join('/');
            const transformers = [
                {
                    operation: 'ROUTINE',
                    args: [
                        {
                            name: 'value',
                            type: 'string',
                            value: finalRoutine,
                        },
                    ],
                },
            ];
            updateDefaultValueTransformers(transformers);
        } else {
            setFirst(false);
        }
    }, [routine, routineArgs]);

    // @ts-expect-error TS7006
    const handleRoutineChange = (event) => {
        setRoutine(event.target.value);
        setRoutineFields([null]);
        setRoutineArgs([]);
    };

    // @ts-expect-error TS7006
    const handleRoutineFieldChange = (newIndex, newValue) => {
        const newField = routineFields.map((field, index) => {
            if (index === newIndex) {
                return newValue;
            }
            return field;
        });
        setRoutineFields(newField);
        // @ts-expect-error TS2345
        setRoutineArgs(newField.map((field) => field.name));
    };

    const handleAddField = () => {
        setRoutineFields([...routineFields, null]);
    };

    // @ts-expect-error TS7006
    const handleDeleteField = (deleteIndex) => {
        if (deleteIndex === 0 && routineFields.length === 1) {
            setRoutineFields([null]);
            setRoutineArgs([]);
            return;
        }
        const newField = routineFields
            .map((field, index) => {
                if (index === deleteIndex) {
                    return undefined;
                }
                return field;
            })
            .filter((field) => field !== undefined);
        setRoutineFields(newField);
        // @ts-expect-error TS2345
        setRoutineArgs(newField.map((field) => field.name));
    };

    return (
        <Box mt={4} sx={{ flexGrow: 1, overflow: 'hidden', px: 3 }}>
            <Box
                sx={{ width: '100%' }}
                mt={1}
                display="flex"
                alignItems="center"
            >
                <RoutineCatalogAutocomplete
                    // @ts-expect-error TS2322
                    onChange={handleRoutineChange}
                    currentValue={routine}
                    label={translate('enter_a_routine_value')}
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
                    onChange={handleRoutineChange}
                    currentValue={value}
                />
            </Box>

            <Box mt={3} sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2">
                    {translate('routine_args')}
                </Typography>

                {routineFields.map((field, index) => (
                    <Box
                        // @ts-expect-error TS2339
                        key={`${field?.name ?? 'default'}_${index}`}
                        sx={{ width: '100%' }}
                        mt={1}
                        display="flex"
                        alignItems="center"
                    >
                        <SearchAutocomplete
                            testId={`autocomplete_routine_args_${index}`}
                            translation={`${translate('routine_arg')}${index + 1}`}
                            fields={fieldsResource}
                            onChange={(_, newValue) => {
                                handleRoutineFieldChange(index, newValue);
                            }}
                            value={field}
                            clearText={translate('clear')}
                        />
                        <Tooltip title={translate('routine_arg_delete')}>
                            <IconButton
                                color="warning"
                                aria-label="delete field"
                                sx={{ marginLeft: '10px' }}
                                onClick={() => handleDeleteField(index)}
                            >
                                <DeleteIcon fontSize="medium" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                ))}

                <Box
                    mt={1}
                    sx={{
                        width: 'fit-content',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                >
                    <Tooltip title={translate('routine_arg_add')}>
                        <IconButton
                            color="primary"
                            aria-label="add field"
                            onClick={handleAddField}
                            sx={{ marginRight: '50px' }}
                        >
                            <AddIcon fontSize="medium" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    );
};

SourceValueRoutine.propTypes = {
    updateDefaultValueTransformers: PropTypes.func.isRequired,
    value: PropTypes.string,
};

export default SourceValueRoutine;
