import React from 'react';
import PropTypes from 'prop-types';
import merge from '../lib/merge';
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
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../propTypes';
import SelectFormat from './SelectFormat';
import { getAdminComponent, getFormatInitialArgs } from '.';
import CancelButton from '../lib/components/CancelButton';

const FormatEditionDialog = ({
    p: polyglot,
    isOpen,
    handleClose,
    formats,
    currentValue,
    input,
}) => {
    const [name, setName] = React.useState(currentValue);
    const [args, setArgs] = React.useState(
        currentValue === input.value.name
            ? merge(getFormatInitialArgs(input.value.name), input.value.args)
            : getFormatInitialArgs(currentValue),
    );

    const setFormat = name => {
        setName(name);
        if (name !== input.value.name) {
            setArgs(getFormatInitialArgs(name));
        }
        if (name === input.value.name) {
            setArgs(merge(getFormatInitialArgs(name), input.value.args));
        }
    };

    const handleSave = () => {
        input.onChange({
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
                {polyglot.t('format_settings')}
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
                        formats={formats}
                        value={name}
                        onChange={setFormat}
                    />
                </Box>
                <AdminComponent onChange={setArgs} args={args} />
            </DialogContent>
            <DialogActions>
                <CancelButton
                    aria-label={polyglot.t('cancel')}
                    onClick={handleClose}
                >
                    {polyglot.t('cancel')}
                </CancelButton>
                <Button
                    aria-label={polyglot.t('save')}
                    color="primary"
                    variant="contained"
                    onClick={handleSave}
                >
                    {polyglot.t('save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

FormatEditionDialog.propTypes = {
    p: polyglotPropTypes.isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    formats: PropTypes.arrayOf(PropTypes.object).isRequired,
    currentValue: PropTypes.string,
    input: PropTypes.shape({
        onChange: PropTypes.func.isRequired,
        value: PropTypes.object.isRequired,
    }).isRequired,
};

export default translate(FormatEditionDialog);
