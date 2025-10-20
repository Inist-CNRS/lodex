import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Box,
} from '@mui/material';
import type { Tenant } from './Tenants';

type UpdateTenantDialogProps = {
    isOpen: boolean;
    tenant: Tenant | null;
    handleClose(): void;
    updateAction(value: string, tenant: Omit<Tenant, '_id'>): void;
};

const UpdateTenantDialog = ({
    isOpen,
    tenant,
    handleClose,
    updateAction,
}: UpdateTenantDialogProps) => {
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isOpen) {
            setDescription(tenant?.description || '');
            setAuthor(tenant?.author || '');
            setUsername(tenant?.username || '');
            setPassword(tenant?.password || '');
        }
    }, [isOpen, tenant]);

    // @ts-expect-error TS7006
    const handleDescription = (event) => {
        setDescription(event.target.value);
    };

    // @ts-expect-error TS7006
    const handleAuthor = (event) => {
        setAuthor(event.target.value);
    };

    // @ts-expect-error TS7006
    const handleUsername = (event) => {
        setUsername(event.target.value);
    };

    // @ts-expect-error TS7006
    const handlePassword = (event) => {
        setPassword(event.target.value);
    };

    // @ts-expect-error TS7006
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!tenant) {
            return;
        }
        updateAction(tenant._id, {
            description,
            author,
            username,
            password,
        });
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            scroll="body"
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>Modifier instance: {tenant?.name}</DialogTitle>
            <DialogContent
                sx={{
                    overflow: 'visible',
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Box mt={1}>
                        <TextField
                            id="tenant-description-field"
                            fullWidth
                            label="Description"
                            placeholder="Entrer une description"
                            onChange={handleDescription}
                            value={description}
                        />
                    </Box>

                    <Box mt={1}>
                        <TextField
                            id="tenant-author-field"
                            fullWidth
                            label="Auteur"
                            placeholder="Entrer le nom de l'auteur"
                            onChange={handleAuthor}
                            value={author}
                        />
                    </Box>

                    <Box mt={1}>
                        <TextField
                            id="tenant-username-field"
                            fullWidth
                            label="Username"
                            placeholder="Username"
                            onChange={handleUsername}
                            required
                            value={username}
                        />
                    </Box>

                    <Box mt={1}>
                        <TextField
                            id="tenant-password-field"
                            fullWidth
                            label="Password"
                            placeholder="Mot de passe"
                            onChange={handlePassword}
                            required
                            value={password}
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
                            variant="contained"
                            type="submit"
                        >
                            Modifier
                        </Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateTenantDialog;
