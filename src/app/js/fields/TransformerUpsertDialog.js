import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import { connect } from 'react-redux';
import { fromFields } from '../sharedSelectors';
import {
    Autocomplete,
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    ListItem,
    TextField,
    Typography,
} from '@mui/material';

import classNames from 'classnames';
import colorsTheme from '../../custom/colorsTheme';
import { DialogActions, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    item: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: colorsTheme.black.veryLight,
        },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderBottom: `1px solid ${colorsTheme.black.light}`,
        '&:last-child': {
            borderBottom: 'none',
        },
    },
    selectedItem: {
        backgroundColor: colorsTheme.green.secondary,
        '&:hover': {
            backgroundColor: colorsTheme.green.primary,
        },
    },
});

const TransformerUpsertDialog = ({
    isOpen = false,
    fields,
    indexFieldToEdit = null,
    availableTransformers,
    p: polyglot,
    handleClose,
}) => {
    const classes = useStyles();
    const [transformer, setTransformer] = React.useState(
        indexFieldToEdit ? fields.get(indexFieldToEdit) : {},
    );

    if (!isOpen) {
        return null;
    }

    if (!transformer) {
        return null;
    }

    const handleChangeOperation = newValue => {
        setTransformer(transformer => ({
            ...transformer,
            operation: newValue,
        }));
    };

    const handleUpsert = () => {
        if (indexFieldToEdit) {
            fields.remove(indexFieldToEdit);
            fields.insert(indexFieldToEdit, transformer);
        } else {
            fields.push(transformer);
        }
        handleClose();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} scroll="body" maxWidth="lg">
            <DialogTitle>
                {indexFieldToEdit ? 'Edit transfo' : 'New transfor'}
            </DialogTitle>

            <DialogContent style={{ padding: 10, width: '800px' }}>
                <Box display={'flex'} flexDirection="column">
                    <Autocomplete
                        value={transformer.operation}
                        onChange={(event, newValue) => {
                            handleChangeOperation(newValue);
                        }}
                        options={availableTransformers}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={polyglot.t('select_an_operation')}
                                variant="outlined"
                            />
                        )}
                        renderOption={(props, option, state) => {
                            return (
                                <ListItem
                                    {...props}
                                    className={classNames(classes.item, {
                                        [classes.selectedItem]: state.selected,
                                    })}
                                >
                                    <Typography>{option}</Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        {polyglot.t(`transformer_${option}`)}
                                    </Typography>
                                </ListItem>
                            );
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <button onClick={handleClose}>Cancel</button>
                <button onClick={handleUpsert}>Save</button>
            </DialogActions>
        </Dialog>
    );
};

TransformerUpsertDialog.propTypes = {
    isOpen: PropTypes.bool,
    indexFieldToEdit: PropTypes.number,
    availableTransformers: PropTypes.array,
    transformerArgs: PropTypes.array,
    p: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    fields: PropTypes.shape({
        get: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
        insert: PropTypes.func.isRequired,
    }).isRequired,
};

const mapStateToProps = (state, { type }) => ({
    availableTransformers: fromFields
        .getTransformers(state, type)
        .map(transformer => transformer.name),
});

export default compose(
    connect(mapStateToProps, null),
    translate,
)(TransformerUpsertDialog);
