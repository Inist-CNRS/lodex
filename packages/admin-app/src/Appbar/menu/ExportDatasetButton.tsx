import {
    Autocomplete,
    Button,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    TextField,
} from '@mui/material';
// @ts-expect-error TS7016
import CancelIcon from '@mui/material/internal/svg-icons/Cancel';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import ClearIcon from '@mui/icons-material/Clear';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import StorageIcon from '@mui/icons-material/Storage';
import { dumpDataset } from '../../dump';
import { fromDump } from '../../selectors.ts';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext.tsx';
import CancelButton from '../../../../../src/app/js/lib/components/CancelButton.tsx';

import datasetApi from '../../api/dataset.ts';

type ExportDatasetButtonComponentProps = {
    dumpDataset(...args: unknown[]): unknown;
    loading?: boolean;
    disabled?: boolean;
    onDone(...args: unknown[]): unknown;
    choices: string[];
};

export const ExportDatasetButtonComponent = ({
    dumpDataset,
    loading,
    disabled,
    onDone,
    choices,
}: ExportDatasetButtonComponentProps) => {
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
                        <Autocomplete
                            multiple
                            options={choices}
                            value={selectedFields}
                            onChange={(_event, newValue) => {
                                setSelectedFields(newValue);
                            }}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        // @ts-expect-error TS2783
                                        key={option}
                                        label={option}
                                        {...getTagProps({ index })}
                                        deleteIcon={
                                            <CancelIcon
                                                aria-hidden={false}
                                                aria-label={translate(
                                                    'remove_field_from_export',
                                                    {
                                                        field: option,
                                                    },
                                                )}
                                                focusable
                                            />
                                        }
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={translate('export_choose_fields')}
                                />
                            )}
                            renderOption={(props, option, { selected }) => {
                                return (
                                    <ListItem
                                        {...props}
                                        key={option}
                                        role="option"
                                        aria-label={option}
                                    >
                                        <Checkbox checked={selected} />
                                        <ListItemText primary={option} />
                                    </ListItem>
                                );
                            }}
                        />
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

// @ts-expect-error TS7006
export const ExportDatasetButtonWithFetch = (props) => {
    const [choices, setChoices] = useState(null);
    useEffect(() => {
        const fetchDataColumns = async () => {
            const { columns } = await datasetApi.getDatasetColumns();
            setChoices(
                // @ts-expect-error TS7031
                columns.map(({ key }) => key).filter((name) => name !== '_id'),
            );
        };
        fetchDataColumns();
    }, []);

    if (!choices) {
        return null;
    }

    return <ExportDatasetButtonComponent {...props} choices={choices} />;
};

export const ExportDatasetButton = connect(
    (state) => ({
        // @ts-expect-error TS2339
        loading: fromDump.isDumpLoading(state),
    }),
    {
        dumpDataset,
    },
)(ExportDatasetButtonWithFetch);
