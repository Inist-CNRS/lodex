import React from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
import { translate } from '../../i18n/I18NContext';

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
    // @ts-expect-error TS7031
    selected,
    // @ts-expect-error TS7031
    name,
    // @ts-expect-error TS7031
    docUrl,
    // @ts-expect-error TS7031
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
    // @ts-expect-error TS7031
    availableTransformers,
    // @ts-expect-error TS7031
    docUrlByTransformer,
    // @ts-expect-error TS7031
    fields,
    indexFieldToEdit = null,
    isOpen = false,
    // @ts-expect-error TS7031
    handleClose,
    // @ts-expect-error TS7031
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

    // @ts-expect-error TS7006
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
                        // @ts-expect-error TS7006
                        onChange={(args) => {
                            // @ts-expect-error TS7006
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

// @ts-expect-error TS7006
const mapStateToProps = (state, { type }) => {
    // @ts-expect-error TS2339
    const transformers = fromFields.getTransformers(state, type);
    return {
        // @ts-expect-error TS7031
        availableTransformers: transformers.map(({ name }) => name),
        docUrlByTransformer: transformers.reduce(
            // @ts-expect-error TS7006
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
