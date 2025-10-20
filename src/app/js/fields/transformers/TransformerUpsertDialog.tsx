import React from 'react';
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

interface TransformerItemProps {
    selected: boolean;
    name: string;
    docUrl?: string;
    polyglot: unknown;
}

export const TransformerItem = ({
    selected,

    name,

    docUrl,

    polyglot,

    ...props
}: TransformerItemProps) => {
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

interface TransformerUpsertDialogProps {
    availableTransformers?: unknown[];
    docUrlByTransformer: Record<string, string>;
    fields: unknown[];
    append(...args: unknown[]): unknown;
    update(...args: unknown[]): unknown;
    handleClose(...args: unknown[]): unknown;
    indexFieldToEdit?: number;
    isOpen?: boolean;
    p: unknown;
}

const TransformerUpsertDialog = ({
    availableTransformers,

    docUrlByTransformer,

    fields,

    append,

    update,

    indexFieldToEdit = null,
    isOpen = false,

    handleClose,

    p: polyglot
}: TransformerUpsertDialogProps) => {
    const [transformer, setTransformer] = React.useState(
        indexFieldToEdit !== null ? fields?.[indexFieldToEdit] ?? {} : {},
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
            update(indexFieldToEdit, transformer);
        } else {
            append(transformer);
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
                        // @ts-expect-error TS6133
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
                        // @ts-expect-error TS2322
                        operation={transformer.operation}
                        transformerArgs={transformer.args}
                        // @ts-expect-error TS7006
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

// @ts-expect-error TS7006
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
    // @ts-expect-error TS2345
)(TransformerUpsertDialog);
