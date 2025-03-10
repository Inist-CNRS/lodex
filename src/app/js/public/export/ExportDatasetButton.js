import React, { useMemo, useState } from 'react';
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
import PropTypes from 'prop-types';

import { dumpDataset } from '../../admin/dump';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromDump } from '../../admin/selectors';
import CancelButton from '../../lib/components/CancelButton';
import { useTranslate } from '../../i18n/I18NContext';
import { fromFields } from '../../sharedSelectors';
import StorageIcon from '@mui/icons-material/Storage';
import ClearIcon from '@mui/icons-material/Clear';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const ExportDatasetButtonComponent = ({
    dumpDataset,
    loading,
    fields,
    disabled,
    onDone,
}) => {
    const { translate } = useTranslate();
    const [isOpen, setIsOpen] = React.useState(false);
    const choices = useMemo(
        () =>
            fields.map((field) => ({
                value: field.name,
                label: field.label || field.name,
            })),
        [fields],
    );
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
                                                selectedField.value ===
                                                // eslint-disable-next-line react/prop-types
                                                props.value.value,
                                        )
                                    ) {
                                        return currentSelectedFields.filter(
                                            (selectedField) =>
                                                selectedField.value !==
                                                // eslint-disable-next-line react/prop-types
                                                props.value.value,
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
                                                key={field.value}
                                                label={field.label}
                                                onMouseDown={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                }}
                                                onDelete={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setSelectedFields(
                                                        selectedFields.filter(
                                                            (selectedField) =>
                                                                selectedField.value !==
                                                                field.value,
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
                                <MenuItem
                                    key={field.value}
                                    value={{
                                        value: field.value,
                                        label: field.label,
                                    }}
                                >
                                    <Checkbox
                                        checked={selectedFields.some(
                                            (selectedField) =>
                                                selectedField.value ===
                                                field.value,
                                        )}
                                    />
                                    <ListItemText primary={field.label} />
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

ExportDatasetButtonComponent.propTypes = {
    dumpDataset: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    loading: PropTypes.bool.isRequired,
    fields: PropTypes.array.isRequired,
    disabled: PropTypes.bool.isRequired,
    onDone: PropTypes.func.isRequired,
};

export const ExportDatasetButton = connect(
    (state) => ({
        loading: fromDump.isDumpLoading(state),
        fields: fromFields.getFields(state),
    }),
    {
        dumpDataset,
    },
)(ExportDatasetButtonComponent);
