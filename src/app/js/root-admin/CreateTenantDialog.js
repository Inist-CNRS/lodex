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
    TextField,
} from '@mui/material';

import NameField from './NameField';
import {
    checkForbiddenNames,
    forbiddenNamesMessage,
    getTenantMaxSize,
    MAX_DB_NAME_SIZE,
} from '../../../common/tools/tenantTools';

const CreateTenantDialog = ({ isOpen, handleClose, createAction }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');

    return (
        <Dialog open={isOpen} onClose={handleClose} scroll="body" maxWidth="md">
            <DialogTitle>Créer une nouvelle instance</DialogTitle>
            <DialogContent>
                <FormControl sx={{ marginTop: '1em', width: '100%' }}>
                    <InputLabel htmlFor="tenant-name-field">Nom</InputLabel>
                    <NameField
                        id="tenant-name-field"
                        fullWidth
                        placeholder={`Entrer le nom technique de l'instance`}
                        onChange={(event) => setName(event.target.value)}
                        error={checkForbiddenNames(name)}
                        value={name}
                    />
                    <FormHelperText
                        id="component-helper-text"
                        sx={{ margin: 0 }}
                    >
                        Une instance ne peut pas être nommée{' '}
                        {forbiddenNamesMessage}. Pour composer le nom, seules
                        les lettres en minuscules, les chiffres et le tiret "-"
                        sont autorisés. Une limitation en nombre de caractères
                        est automatiquement appliquée en fonction du nom du
                        container de l’instance (
                        {getTenantMaxSize(window.__DBNAME__)} caractères).
                    </FormHelperText>
                </FormControl>

                <TextField
                    id="tenant-description-field"
                    fullWidth
                    label="Description"
                    placeholder="Entrer une description"
                    onChange={(event) => setDescription(event.target.value)}
                    value={description}
                    sx={{ marginTop: '1em' }}
                />

                <TextField
                    id="tenant-author-field"
                    fullWidth
                    label="Auteur"
                    placeholder="Entrer le nom de l'auteur"
                    onChange={(event) => setAuthor(event.target.value)}
                    value={author}
                    sx={{ marginTop: '1em' }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        createAction({ name, description, author });
                        setName('');
                        setDescription('');
                        setAuthor('');
                    }}
                    disabled={checkForbiddenNames(name)}
                    sx={{ height: '100%' }}
                >
                    Créer
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
