import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Button,
    TextField,
} from '@mui/material';

const UpdateTenantDialog = ({ tenant, handleClose, updateAction }) => {
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        setDescription(tenant?.description || '');
        setAuthor(tenant?.author || '');
        setUsername(tenant?.username || '');
        setPassword(tenant?.password || '');
    }, [tenant]);

    return (
        <Dialog
            open={!!tenant}
            onClose={handleClose}
            scroll="body"
            maxWidth="md"
        >
            <DialogTitle>Modifier instance: {tenant?.name}</DialogTitle>
            <DialogContent>
                <TextField
                    id="tenant-description-field"
                    fullWidth
                    label="Description"
                    placeholder="Entrer une description"
                    onChange={event => setDescription(event.target.value)}
                    value={description}
                    sx={{ marginTop: '1em' }}
                />

                <TextField
                    id="tenant-author-field"
                    fullWidth
                    label="Auteur"
                    placeholder="Entrer le nom de l'auteur"
                    onChange={event => setAuthor(event.target.value)}
                    value={author}
                    sx={{ marginTop: '1em' }}
                />
                <TextField
                    id="tenant-username-field"
                    fullWidth
                    label="Username"
                    placeholder="Username"
                    onChange={event => setUsername(event.target.value)}
                    value={username}
                    sx={{ marginTop: '1em' }}
                />
                <TextField
                    id="tenant-password-field"
                    fullWidth
                    label="Password"
                    placeholder="Mot de passe"
                    onChange={event => setPassword(event.target.value)}
                    value={password}
                    sx={{ marginTop: '1em' }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        updateAction(tenant._id, {
                            description,
                            author,
                            username,
                            password,
                        });
                        setDescription('');
                        setAuthor('');
                        setUsername('');
                        setPassword('');
                    }}
                    sx={{ height: '100%' }}
                >
                    Modifier
                </Button>
            </DialogActions>
        </Dialog>
    );
};

UpdateTenantDialog.propTypes = {
    tenant: PropTypes.object,
    handleClose: PropTypes.func.isRequired,
    updateAction: PropTypes.func.isRequired,
};

export default UpdateTenantDialog;
