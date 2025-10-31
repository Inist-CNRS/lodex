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
import type { Tenant } from './Tenants';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useRemoveTenant = ({
    onSuccess,
    onError,
}: {
    onSuccess: () => void;
    onError: () => void;
}) => {
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: async ({
            id,
            name,
            deleteDatabase,
        }: {
            id: string;
            name: string;
            deleteDatabase: boolean;
        }): Promise<Tenant[]> => {
            const response = await fetch('/rootAdmin/tenant', {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Lodex-Tenant': 'admin',
                },
                method: 'DELETE',
                body: JSON.stringify({ _id: id, name, deleteDatabase }),
            });

            if (response.status === 401) {
                throw new Error('Unauthorized');
            }

            if (response.status === 403) {
                throw new Error('Forbidden');
            }

            if (!response.ok) {
                throw new Error('Failed to delete tenant');
            }

            return response.json();
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['tenants'], data);
            toast.success('Instance supprimée', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: 'light',
            });
            onSuccess();
        },
        onError: (error: Error) => {
            if (error.message === 'Forbidden') {
                toast.error('Action non autorisée', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: 'light',
                });
            } else if (error.message === 'Unauthorized') {
                onError();
            } else {
                toast.error("Erreur lors de la suppression de l'instance", {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: 'light',
                });
            }
        },
    });

    return mutate;
};

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
