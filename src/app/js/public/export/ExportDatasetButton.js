import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
    Button,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    Stack,
} from '@mui/material';
import CancelIcon from '@mui/material/internal/svg-icons/Cancel';
import PropTypes from 'prop-types';

import { dumpDataset } from '../../admin/dump';
import { fromDump } from '../../admin/selectors';
import CancelButton from '../../lib/components/CancelButton';
import { useTranslate } from '../../i18n/I18NContext';
import StorageIcon from '@mui/icons-material/Storage';
import ClearIcon from '@mui/icons-material/Clear';
import DoneAllIcon from '@mui/icons-material/DoneAll';

import datasetApi from '../../admin/api/dataset';

export const ExportDatasetButtonComponent = ({
    dumpDataset,
    loading,
    disabled,
    onDone,
    choices,
}) => {
    const { translate } = useTranslate();
    const [isOpen, setIsOpen] = React.useState(false);

    const [selectedFields, setSelectedFields] = useState(choices);

    const onClose = () => setIsOpen(false);
    const onOpen = () => setIsOpen(true);

    return (
        <>
            <MenuItem
                key="export_raw_dataset"
                onClick={onOpen}
                disabled={disabled}
            >
                <ListItemIcon>
                    <StorageIcon />
                </ListItemIcon>
                <ListItemText primary={translate('export_raw_dataset')} />
            </MenuItem>
            <Dialog maxWidth="lg" fullWidth open={isOpen} onClose={onClose}>
                <DialogTitle>
                    {translate('what_data_do_you_want_to_export')}
                </DialogTitle>
                <DialogContent sx={{ paddingTop: '1rem!important' }}>
                    <FormControl fullWidth>
                        <InputLabel id="export_choose_fields">
                            {translate('export_choose_fields')}
                        </InputLabel>
                        <Select
                            label={`${translate('export_choose_fields')} *`}
                            labelId={'export_choose_fields'}
                            value={selectedFields}
                            multiple
                            onChange={(e, { props }) => {
                                setSelectedFields((currentSelectedFields) => {
                                    if (
                                        currentSelectedFields.some(
                                            (selectedField) =>
                                                selectedField ===
                                                // eslint-disable-next-line react/prop-types
                                                props.value,
                                        )
                                    ) {
                                        return currentSelectedFields.filter(
                                            (selectedField) =>
                                                selectedField !==
                                                // eslint-disable-next-line react/prop-types
                                                props.value,
                                        );
                                    }
                                    return [
                                        ...currentSelectedFields,
                                        // eslint-disable-next-line react/prop-types
                                        props.value,
                                    ];
                                });
                            }}
                            minRows={500}
                            multiline
                            renderValue={(selected) => {
                                return (
                                    <Stack
                                        direction={'row'}
                                        flexWrap={'wrap'}
                                        gap={1}
                                    >
                                        {selected.map((field) => (
                                            <Chip
                                                key={field}
                                                label={field}
                                                onMouseDown={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                }}
                                                deleteIcon={
                                                    // overriding the default delete icon with itself to remove aria-hidden, add an aria-label and make it focusable
                                                    <CancelIcon
                                                        aria-hidden={false}
                                                        aria-label={translate(
                                                            'remove_field_from_export',
                                                            {
                                                                field,
                                                            },
                                                        )}
                                                        focusable
                                                    />
                                                }
                                                onDelete={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setSelectedFields(
                                                        selectedFields.filter(
                                                            (selectedField) =>
                                                                selectedField !==
                                                                field,
                                                        ),
                                                    );
                                                }}
                                            />
                                        ))}
                                    </Stack>
                                );
                            }}
                        >
                            {choices.map((field) => (
                                <MenuItem key={field} value={field}>
                                    <Checkbox
                                        checked={selectedFields.some(
                                            (selectedField) =>
                                                selectedField === field,
                                        )}
                                    />
                                    <ListItemText primary={field} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <IconButton
                        title={translate('clear_all')}
                        onClick={() => setSelectedFields([])}
                    >
                        <ClearIcon />
                    </IconButton>
                    <IconButton
                        title={translate('select_all')}
                        onClick={() => setSelectedFields(choices)}
                    >
                        <DoneAllIcon />
                    </IconButton>
                </DialogContent>
                <DialogActions>
                    <CancelButton
                        key="cancel"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {translate('cancel')}
                    </CancelButton>
                    <Button
                        variant="contained"
                        color="primary"
                        key="confirm"
                        disabled={!selectedFields.length}
                        onClick={() => {
                            dumpDataset(selectedFields);
                            onClose();
                            onDone();
                        }}
                    >
                        {translate('confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export const ExportDatasetButtonWithFetch = (props) => {
    const [choices, setChoices] = useState(null);
    useEffect(() => {
        const fetchDataColumns = async () => {
            const { columns } = await datasetApi.getDatasetColumns();
            setChoices(columns.map(({ key }) => key));
        };
        fetchDataColumns();
    }, []);

    if (!choices) {
        return null;
    }

    return <ExportDatasetButtonComponent {...props} choices={choices} />;
};

ExportDatasetButtonComponent.propTypes = {
    dumpDataset: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    onDone: PropTypes.func.isRequired,
    choices: PropTypes.array,
};

export const ExportDatasetButton = connect(
    (state) => ({
        loading: fromDump.isDumpLoading(state),
    }),
    {
        dumpDataset,
    },
)(ExportDatasetButtonWithFetch);
