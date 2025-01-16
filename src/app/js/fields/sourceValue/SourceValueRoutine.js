import React, { useEffect, useMemo, useState } from 'react';
import { compose } from 'recompose';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PropTypes from 'prop-types';
import RoutineCatalog from '../wizard/RoutineCatalog';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { fromFields } from '../../sharedSelectors';
import { loadField } from '../index';
import { connect } from 'react-redux';
import { getFieldForSpecificScope } from '../../../../common/scope';
import SearchAutocomplete from '../../admin/Search/SearchAutocomplete';
import RoutineCatalogAutocomplete from '../wizard/RoutineCatalogAutocomplete';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const SourceValueRoutine = ({
    fields,
    updateDefaultValueTransformers,
    value,
    p: polyglot,
}) => {
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
            setRoutineArgs(args);
            const filteredRoutineFields = args
                .map((arg) => {
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

    const handleRoutineChange = (event) => {
        setRoutine(event.target.value);
        setRoutineFields([null]);
        setRoutineArgs([]);
    };

    const handleRoutineFieldChange = (newIndex, newValue) => {
        const newField = routineFields.map((field, index) => {
            if (index === newIndex) {
                return newValue;
            }
            return field;
        });
        setRoutineFields(newField);
        setRoutineArgs(newField.map((field) => field.name));
    };

    const handleAddField = () => {
        setRoutineFields([...routineFields, null]);
    };

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
                    onChange={handleRoutineChange}
                    currentValue={routine}
                    label={polyglot.t('enter_a_routine_value')}
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
                    onChange={handleRoutineChange}
                    currentValue={value}
                />
            </Box>

            <Box mt={3} sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2">
                    {polyglot.t('routine_args')}
                </Typography>

                {routineFields.map((field, index) => (
                    <Box
                        key={`${field?.name ?? 'default'}_${index}`}
                        sx={{ width: '100%' }}
                        mt={1}
                        display="flex"
                        alignItems="center"
                    >
                        <SearchAutocomplete
                            testId={`autocomplete_routine_args_${index}`}
                            translation={`${polyglot.t('routine_arg')}${index + 1}`}
                            fields={fieldsResource}
                            onChange={(_, newValue) => {
                                handleRoutineFieldChange(index, newValue);
                            }}
                            value={field}
                            clearText={polyglot.t('clear')}
                        />
                        <Tooltip title={polyglot.t('routine_arg_delete')}>
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
                    <Tooltip title={polyglot.t('routine_arg_add')}>
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

const mapStateToProps = (state) => {
    return {
        // sort by label asc
        fields: fromFields
            .getFields(state)
            .sort((a, b) => a.label.localeCompare(b.label)),
    };
};

const mapDispatchToProps = {
    loadField,
};

SourceValueRoutine.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    p: polyglotPropTypes.isRequired,
    updateDefaultValueTransformers: PropTypes.func.isRequired,
    value: PropTypes.string,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(SourceValueRoutine);
