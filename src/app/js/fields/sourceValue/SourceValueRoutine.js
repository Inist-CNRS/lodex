import React from 'react';
import { compose } from 'recompose';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PropTypes from 'prop-types';
import RoutineCatalog from '../wizard/RoutineCatalog';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { Box, Button, TextField } from '@mui/material';
import { fromFields } from '../../sharedSelectors';
import { loadField } from '../index';
import { connect } from 'react-redux';
import { getFieldForSpecificScope } from '../../../../common/scope';
import SearchAutocomplete from '../../admin/Search/SearchAutocomplete';

const SourceValueRoutine = ({
    fields,
    updateDefaultValueTransformers,
    value,
    p: polyglot,
}) => {
    const [openRoutineCatalog, setOpenRoutineCatalog] = React.useState(false);
    const [valueInput, setValueInput] = React.useState(value || '');
    const [routine, setRoutine] = React.useState('');
    const [routineArgs, setRoutineArgs] = React.useState([]);
    const [routineFields, setRoutineFields] = React.useState([]);
    const [first, setFirst] = React.useState(true);

    const fieldsResource = React.useMemo(
        () => getFieldForSpecificScope(fields, 'collection'),
        [fields],
    );

    React.useEffect(() => {
        if (typeof value === 'string') {
            setRoutine(value.split('/').slice(0, 4).join('/'));
            const args = value.split('/').slice(4);
            setRoutineArgs(args);
            setRoutineFields(
                fieldsResource.filter((field) => {
                    return args.includes(field.name);
                }),
            );
        }
    }, [value]);

    React.useEffect(() => {
        if (!first) {
            handleChange({
                target: {
                    value: [routine, ...routineArgs].join('/'),
                },
            });
        } else {
            setFirst(false);
        }
    }, [routine, routineArgs]);

    const handleChange = (event) => {
        setValueInput(event.target.value);
        const transformers = [
            {
                operation: 'ROUTINE',
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

    const handleRoutineFieldsChange = (event, newValue) => {
        setRoutineFields(newValue);
        setRoutineArgs(newValue.map((field) => field.name));
    };

    return (
        <Box mt={4} sx={{ flexGrow: 1, overflow: 'hidden', px: 3 }}>
            <Box
                sx={{ width: '100%' }}
                mt={1}
                display="flex"
                alignItems="center"
            >
                <TextField
                    fullWidth
                    placeholder={polyglot.t('enter_a_routine_value')}
                    label={polyglot.t('routine_value')}
                    value={routine}
                    disabled
                    aria-readonly
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
                    onChange={handleChange}
                    currentValue={value}
                />
            </Box>

            <Box
                sx={{ width: '100%' }}
                mt={1}
                display="flex"
                alignItems="center"
            >
                <SearchAutocomplete
                    testId="autocomplete_routine_args"
                    translation={polyglot.t('search_in_fields')}
                    fields={fieldsResource}
                    onChange={handleRoutineFieldsChange}
                    value={routineFields}
                    multiple
                    clearText={polyglot.t('clear')}
                />
            </Box>

            <Box
                sx={{ width: '100%' }}
                mt={1}
                display="flex"
                alignItems="center"
            >
                <TextField
                    fullWidth
                    placeholder={polyglot.t('enter_a_routine_value')}
                    label={polyglot.t('routine_value')}
                    onChange={handleChange}
                    value={valueInput}
                />
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
