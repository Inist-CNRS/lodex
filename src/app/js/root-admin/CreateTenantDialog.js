import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Button,
    FormControl,
    FormHelperText,
    TextField,
    Box,
} from '@mui/material';

import { deburr } from 'lodash';

import {
    checkForbiddenNames,
    forbiddenNamesMessage,
    getTenantMaxSize,
} from '../../../common/tools/tenantTools';

const cleanUpName = (name) => {
    // We replace any accented and special char with the base letter or a dash
    // https://stackoverflow.com/questions/36557202/replacing-special-characters-with-dashes

    return deburr(name)
        .replace(/\s+/g, '-')
        .replace(/_/g, '-')
        .replace(/\W+/g, '-')
        .replace(/^-/, '')
        .replace(/-$/, '')
        .substring(0, getTenantMaxSize(window.__DBNAME__))
        .toLowerCase();
};

const CreateTenantDialog = ({ isOpen, handleClose, createAction }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName('');
            setDescription('');
            setAuthor('');
        }
    }, [isOpen]);

    const handleName = (event) => {
        setName(cleanUpName(event.target.value));
    };

    const handleDescription = (event) => {
        setDescription(event.target.value);
    };

    const handleAuthor = (event) => {
        setAuthor(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        createAction({ name: cleanUpName(name), description, author });
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            scroll="body"
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>Créer une nouvelle instance</DialogTitle>
            <DialogContent
                sx={{
                    overflow: 'visible',
                }}
            >
                <form onSubmit={handleSubmit}>
                    <FormControl mt={1} fullWidth>
                        <TextField
                            id="tenant-name-field"
                            label="Nom"
                            fullWidth
                            placeholder="Entrer le nom technique de l'instance"
                            onChange={handleName}
                            error={checkForbiddenNames(name)}
                            value={name}
                            required
                        />
                        <FormHelperText
                            id="component-helper-text"
                            sx={{ margin: 0 }}
                        >
                            Une instance ne peut pas être nommée{' '}
                            {forbiddenNamesMessage}. Pour composer le nom,
                            seules les lettres en minuscules, les chiffres et le
                            tiret &quot;-&quot; sont autorisés. Une limitation
                            en nombre de caractères est automatiquement
                            appliquée en fonction du nom du container de
                            l’instance ({getTenantMaxSize(window.__DBNAME__)}{' '}
                            caractères).
                        </FormHelperText>
                    </FormControl>

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
                            disabled={checkForbiddenNames(name)}
                            variant="contained"
                            type="submit"
                        >
                            Créer
                        </Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
};

CreateTenantDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    createAction: PropTypes.func.isRequired,
};

export default CreateTenantDialog;
