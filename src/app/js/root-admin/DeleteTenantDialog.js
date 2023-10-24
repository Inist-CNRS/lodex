import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    TextField,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Button,
} from '@mui/material';

const DeleteTenantDialog = ({ tenant, handleClose, deleteAction }) => {
    const [name, setName] = useState('');

    return (
        <Dialog
            open={!!tenant}
            onClose={handleClose}
            scroll="body"
            maxWidth="lg"
        >
            <DialogTitle>
                Confirmer la suppression de : <b>{tenant.name}</b>
            </DialogTitle>
            <DialogContent>
                <TextField
                    id="tenant-name-field"
                    fullWidth
                    placeholder={
                        "Taper le nom de l'instance pour confirmer la suppression"
                    }
                    onChange={event => setName(event.target.value)}
                    error={name !== tenant.name}
                    value={name}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        deleteAction(tenant._id, tenant.name);
                        setName('');
                    }}
                    disabled={name !== tenant.name}
                    sx={{ height: '100%' }}
                >
                    Supprimer
                </Button>
            </DialogActions>
        </Dialog>
    );
};

DeleteTenantDialog.propTypes = {
    tenant: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
    handleClose: PropTypes.func.isRequired,
    deleteAction: PropTypes.func.isRequired,
};

export default DeleteTenantDialog;
