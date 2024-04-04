import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    TextField,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Button,
    FormControlLabel,
    Checkbox,
} from '@mui/material';

const DeleteTenantDialog = ({ tenant, handleClose, deleteAction }) => {
    const [name, setName] = useState('');
    const [deleteDatabase, setDeleteDatabase] = useState(true);

    return (
        <Dialog
            open={!!tenant}
            onClose={handleClose}
            scroll="body"
            maxWidth="md"
            fullWidth
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
                    onChange={(event) => setName(event.target.value)}
                    error={name !== tenant.name}
                    value={name}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            defaultChecked
                            value={deleteDatabase}
                            onChange={() => {
                                setDeleteDatabase(!deleteDatabase);
                            }}
                            color="error"
                        />
                    }
                    label="Supprimer la base de données correspondante"
                    labelPlacement="end"
                />
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        deleteAction(tenant._id, tenant.name, deleteDatabase);
                        setName('');
                        setDeleteDatabase(true);
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
