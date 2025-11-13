import { useEffect, useState } from 'react';
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
import type { Tenant } from './types';
import { useRemoveTenant } from './useRemoveTenant';

type DeleteTenantDialogProps = {
    isOpen: boolean;
    tenant: Tenant | null;
    onClose(): void;
    onError(): void;
};

const DeleteTenantDialog = ({
    isOpen,
    tenant,
    onClose,
    onError,
}: DeleteTenantDialogProps) => {
    const [name, setName] = useState('');
    const [deleteDatabase, setDeleteDatabase] = useState(true);
    const [validationOnError, setValidationOnError] = useState(false);

    const removeTenant = useRemoveTenant({
        onSuccess: onClose,
        onError,
    });

    useEffect(() => {
        if (isOpen) {
            setName('');
            setDeleteDatabase(true);
        }
    }, [isOpen]);

    // @ts-expect-error TS7006
    const handleTextValidation = (event) => {
        setName(event.target.value);
        if (!event.target.value || event.target.value !== tenant?.name) {
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
        removeTenant({
            id: tenant._id,
            name: tenant.name!,
            deleteDatabase,
        });
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
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
                            onClick={onClose}
                        >
                            Annuler
                        </Button>
                        <Button
                            sx={{
                                width: 'calc(50% - 4px)',
                                marginLeft: '4px',
                            }}
                            disabled={validationOnError || !name}
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
