import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import { fromFields } from '../../sharedSelectors';

import { connect } from 'react-redux';
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    DialogActions,
    ListItemButton,
} from '@mui/material';

import TransformerArg from './TransformerArg';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import CancelButton from '../../lib/components/CancelButton';
import customTheme from '../../../custom/customTheme';

const TransformerUpsertDialog = ({
    availableTransformers,
    fields,
    indexFieldToEdit = null,
    isOpen = false,
    handleClose,
    p: polyglot,
}) => {
    const [transformer, setTransformer] = React.useState(
        indexFieldToEdit !== null ? fields.get(indexFieldToEdit) : {},
    );

    if (!isOpen) {
        return null;
    }

    if (!transformer) {
        return null;
    }

    const handleChangeOperation = newValue => {
        setTransformer({
            operation: newValue,
        });
    };

    const handleUpsert = () => {
        if (indexFieldToEdit !== null) {
            fields.splice(indexFieldToEdit, 1, transformer);
        } else {
            fields.push(transformer);
        }
        handleClose();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} scroll="body" maxWidth="lg">
            <DialogTitle>
                {indexFieldToEdit !== null
                    ? polyglot.t('edit_transformer')
                    : polyglot.t('add_transformer')}
            </DialogTitle>

            <DialogContent style={{ padding: 10, width: '800px' }}>
                <Box display={'flex'} flexDirection="column">
                    <Autocomplete
                        aria-label={polyglot.t('select_an_operation')}
                        value={transformer.operation || ''}
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
                                <ListItemButton
                                    {...props}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor:
                                                customTheme.palette.neutralDark
                                                    .veryLight,
                                        },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderBottom: `1px solid ${customTheme.palette.neutralDark.light}`,
                                        '&:last-child': {
                                            borderBottom: 'none',
                                        },
                                        '&.MuiAutocomplete-option[aria-selected="true"].Mui-selected': {
                                            backgroundColor:
                                                customTheme.palette.primary
                                                    .secondary,
                                            '&:hover': {
                                                backgroundColor:
                                                    customTheme.palette.primary
                                                        .main,
                                            },
                                        },
                                    }}
                                    selected={state.selected}
                                >
                                    <Typography>{option}</Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ width: '100%' }}
                                    >
                                        {polyglot.t(`transformer_${option}`)}
                                    </Typography>
                                </ListItemButton>
                            );
                        }}
                    />
                    <TransformerArg
                        operation={transformer.operation}
                        transformerArgs={transformer.args}
                        onChange={args => {
                            setTransformer(transformer => ({
                                ...transformer,
                                args,
                            }));
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <CancelButton
                    aria-label={polyglot.t('cancel')}
                    onClick={handleClose}
                >
                    {polyglot.t('cancel')}
                </CancelButton>
                <Button
                    aria-label={polyglot.t('confirm')}
                    color="primary"
                    variant="contained"
                    onClick={handleUpsert}
                >
                    {polyglot.t('confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

TransformerUpsertDialog.propTypes = {
    availableTransformers: PropTypes.array,
    fields: PropTypes.shape({
        get: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
        splice: PropTypes.func.isRequired,
    }).isRequired,
    handleClose: PropTypes.func.isRequired,
    indexFieldToEdit: PropTypes.number,
    isOpen: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
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
