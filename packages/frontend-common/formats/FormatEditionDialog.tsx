import React from 'react';
import merge from '@lodex/frontend-common/utils/merge';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { ControllerRenderProps } from 'react-hook-form';
import SelectFormat from './SelectFormat';
import { getAdminComponent, getFormatInitialArgs } from './getFormat';
import CancelButton from '@lodex/frontend-common/components/CancelButton';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

const FormatEditionDialog = ({
    isOpen,
    handleClose,
    formats,
    currentValue,
    field,
}: {
    isOpen: boolean;
    handleClose: () => void;
    formats: { name: string; componentName: string }[];
    currentValue: string;
    field: ControllerRenderProps;
}) => {
    const { translate } = useTranslate();

    const [name, setName] = React.useState(currentValue);
    const [args, setArgs] = React.useState(
        currentValue === field.value?.name
            ? merge(getFormatInitialArgs(field.value?.name), field.value?.args)
            : getFormatInitialArgs(currentValue),
    );

    const setFormat = (name: string) => {
        setName(name);
        if (name !== field.value?.name) {
            setArgs(getFormatInitialArgs(name));
        }
        if (name === field.value?.name) {
            setArgs(merge(getFormatInitialArgs(name), field.value?.args));
        }
    };

    const handleSave = () => {
        field.onChange({
            name,
            args,
        });
        handleClose();
    };
    const AdminComponent = getAdminComponent(name);

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            scroll="body"
            maxWidth="lg"
            id="format-edit-dialog"
        >
            <DialogTitle>
                {translate('format_settings')}
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent style={{ padding: 10, width: '800px' }}>
                <Box mb={3}>
                    <SelectFormat
                        // @ts-expect-error TS2322
                        formats={formats}
                        value={name}
                        onChange={setFormat}
                    />
                </Box>
                {/* 
                // @ts-expect-error TS2739 */}
                <AdminComponent onChange={setArgs} args={args} />
            </DialogContent>
            <DialogActions>
                <CancelButton
                    aria-label={translate('cancel')}
                    onClick={handleClose}
                >
                    {translate('cancel')}
                </CancelButton>
                <Button
                    aria-label={translate('confirm')}
                    color="primary"
                    variant="contained"
                    onClick={handleSave}
                >
                    {translate('confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FormatEditionDialog;
