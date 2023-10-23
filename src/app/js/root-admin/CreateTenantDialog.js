import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Button,
    InputLabel,
    FormControl,
    FormHelperText,
} from '@mui/material';

import NameField from './NameField';
import {
    checkForbiddenNames,
    forbiddenNamesMessage,
} from '../../../common/tools/tenantTools';

const CreateTenantDialog = ({ isOpen, handleClose, createAction }) => {
    const [name, setName] = useState('');

    return (
        <Dialog open={isOpen} onClose={handleClose} scroll="body" maxWidth="md">
            <DialogTitle>Create a new tenant</DialogTitle>
            <DialogContent>
                <FormControl sx={{ marginTop: '1em' }}>
                    <InputLabel htmlFor="tenant-name-field">Name</InputLabel>
                    <NameField
                        id="tenant-name-field"
                        fullWidth
                        placeholder={'Enter a tenant name'}
                        onChange={event => setName(event.target.value)}
                        error={checkForbiddenNames(name)}
                        value={name}
                    />
                    <FormHelperText id="component-helper-text">
                        Name can not be {forbiddenNamesMessage}
                    </FormHelperText>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        createAction(name);
                        setName('');
                    }}
                    disabled={checkForbiddenNames(name)}
                    sx={{ height: '100%' }}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

CreateTenantDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    createAction: PropTypes.func.isRequired,
};

export default CreateTenantDialog;
