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
    Link,
} from '@mui/material';

import TransformerArg from './TransformerArg';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import CancelButton from '../../lib/components/CancelButton';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export const TransformerItem = ({
    selected,
    name,
    docUrl,
    polyglot,
    ...props
}) => {
    return (
        <ListItemButton
            {...props}
            sx={{
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: 'var(--neutral-dark-very-light)',
                },
                display: 'flex',
                flexDirection: 'column',
                borderBottom: `1px solid var(--neutral-dark-light)`,
                '&:last-child': {
                    borderBottom: 'none',
                },
                '&.MuiAutocomplete-option[aria-selected="true"].Mui-selected': {
                    backgroundColor: 'var(--primary-secondary)',
                    '&:hover': {
                        backgroundColor: 'var(--primary-main)',
                    },
                },
            }}
            selected={selected}
        >
            <Typography>{name}</Typography>
            <Typography
                variant="body2"
                color="textSecondary"
                sx={{ width: '100%' }}
            >
                {polyglot.t(`transformer_${name}`)}
            </Typography>
            {docUrl && (
                <Link
                    style={{
                        display: 'flex',
                        alignSelf: 'flex-end',
                    }}
                    justifyContent="flex-end"
                    display="flex"
                    href={docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={polyglot.t('tooltip_documentation')}
                    onClick={(e) => e.stopPropagation()}
                >
                    <MenuBookIcon />
                </Link>
            )}
        </ListItemButton>
    );
};

TransformerItem.propTypes = {
    selected: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    docUrl: PropTypes.string,
    polyglot: polyglotPropTypes.isRequired,
};

const TransformerUpsertDialog = ({
    availableTransformers,
    docUrlByTransformer,
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

    const handleChangeOperation = (newValue) => {
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
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={polyglot.t('select_an_operation')}
                                variant="outlined"
                            />
                        )}
                        renderOption={(props, option, state) => {
                            return (
                                <TransformerItem
                                    {...props}
                                    key={option}
                                    name={option}
                                    docUrl={docUrlByTransformer[option]}
                                    selected={state.selected}
                                    polyglot={polyglot}
                                />
                            );
                        }}
                    />
                    <TransformerArg
                        operation={transformer.operation}
                        transformerArgs={transformer.args}
                        onChange={(args) => {
                            setTransformer((transformer) => ({
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
    docUrlByTransformer: PropTypes.objectOf(PropTypes.string).isRequired,
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

const mapStateToProps = (state, { type }) => {
    const transformers = fromFields.getTransformers(state, type);
    return {
        availableTransformers: transformers.map(({ name }) => name),
        docUrlByTransformer: transformers.reduce(
            (acc, { name, docUrl }) => ({
                ...acc,
                [name]: docUrl,
            }),
            {},
        ),
    };
};

export default compose(
    connect(mapStateToProps, null),
    translate,
)(TransformerUpsertDialog);
