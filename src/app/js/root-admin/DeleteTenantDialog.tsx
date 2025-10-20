// @ts-expect-error TS6133
import React, { useEffect, useState } from 'react';
import {
    TextField,
    Dialog,
    DialogContent,
    DialogTitle,
    Button,
    FormControlLabel,
    Checkbox,
    Box,
} from '@mui/material';
import type { Tenant } from './Tenants';

type DeleteTenantDialogProps = {
    isOpen: boolean;
    tenant: Tenant | null;
    handleClose(): void;
    deleteAction(
        id: string,
        name: string | undefined,
        deleteDataBase: boolean,
    ): void;
};

const DeleteTenantDialog = ({
    isOpen,
    tenant,
    handleClose,
    deleteAction,
}: DeleteTenantDialogProps) => {
    const [name, setName] = useState('');
    const [deleteDatabase, setDeleteDatabase] = useState(true);
    const [validationOnError, setValidationOnError] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setDeleteDatabase(true);
        }
    }, [isOpen]);

    // @ts-expect-error TS7006
    const handleTextValidation = (event) => {
        setName(event.target.value);
        if (event.target.value !== tenant?.name) {
            setValidationOnError(true);
        } else {
            setValidationOnError(false);
        }
    };

    const handleDatabaseDeletion = () => {
        setDeleteDatabase(!deleteDatabase);
    };

    // @ts-expect-error TS7006
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!tenant) {
            return;
        }
        deleteAction(tenant._id, tenant.name, deleteDatabase);
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            scroll="body"
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                Confirmer la suppression de : <b>{tenant?.name}</b>
            </DialogTitle>
            <DialogContent
                sx={{
                    overflow: 'visible',
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Box mt={1}>
                        <TextField
                            id="tenant-name-field"
                            fullWidth
                            label="Taper le nom de l'instance pour confirmer la suppression"
                            onChange={handleTextValidation}
                            error={validationOnError}
                            required
                            value={name}
                        />
                    </Box>

                    <Box mt={1}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    defaultChecked
                                    value={deleteDatabase}
                                    onChange={handleDatabaseDeletion}
                                    color="error"
                                />
                            }
                            label="Supprimer la base de données correspondante"
                            labelPlacement="end"
                        />
                    </Box>

                    <Box mt={1}>
                        <Button
                            sx={{
                                width: 'calc(50% - 4px)',
                                marginRight: '4px',
                            }}
                            variant="contained"
                            color="warning"
                            onClick={handleClose}
                        >
                            Annuler
                        </Button>
                        <Button
                            sx={{
                                width: 'calc(50% - 4px)',
                                marginLeft: '4px',
                            }}
                            disabled={validationOnError}
                            variant="contained"
                            color="error"
                            type="submit"
                        >
                            Supprimer
                        </Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteTenantDialog;
