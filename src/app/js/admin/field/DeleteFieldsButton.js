import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromFields } from '../../sharedSelectors';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { removeFieldList } from '../../fields';
import FieldRepresentation from '../../fields/FieldRepresentation';

const DeleteFieldsButtonComponent = ({
    fields,
    isFieldsLoading,
    p: polyglot,
    selectedFields,
    removeFieldList,
}) => {
    const [warningOpen, setWarningOpen] = useState(false);

    const fieldsToDelete = useMemo(() => {
        if (selectedFields.length === 0) {
            return [];
        }

        return fields.filter(({ name }) => selectedFields.includes(name));
    }, [fields, selectedFields]);

    const handleOpenModal = useCallback(async () => {
        setWarningOpen(true);
    }, [fieldsToDelete, removeFieldList]);

    const handleCloseModal = useCallback(async () => {
        setWarningOpen(false);
    }, [fieldsToDelete, removeFieldList]);

    const handleDeleteFields = useCallback(async () => {
        handleCloseModal();
        removeFieldList(fieldsToDelete);
    }, [fieldsToDelete, removeFieldList]);

    return (
        <>
            {fieldsToDelete.length > 0 && (
                <Button
                    variant="outlined"
                    color="primary"
                    disabled={isFieldsLoading}
                    startIcon={<DeleteIcon />}
                    onClick={handleOpenModal}
                    aria-label={polyglot.t('delete_selected_fields')}
                >
                    {polyglot.t('delete_selected_fields')}
                </Button>
            )}
            <Dialog
                open={warningOpen}
                onClose={handleCloseModal}
                aria-labelledby="delete-selected-fields-dialog-title"
                aria-describedby="delete-selected-fields-dialog-description"
            >
                <DialogTitle id="delete-selected-fields-dialog-title">
                    {polyglot.t('delete_selected_fields_title')}
                </DialogTitle>
                <DialogContent>
                    <List>
                        {fieldsToDelete.map((field) => (
                            <ListItem
                                key={field._id}
                                sx={{
                                    display: 'grid',
                                    gridTemplateRows: 'repeat(2, 1fr)',
                                }}
                            >
                                <FieldRepresentation field={field} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseModal}
                        aria-label={polyglot.t('cancel')}
                    >
                        {polyglot.t('cancel')}
                    </Button>
                    <Button
                        onClick={handleDeleteFields}
                        variant="contained"
                        color="primary"
                        autoFocus
                        aria-label={polyglot.t('delete')}
                    >
                        {polyglot.t('delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

DeleteFieldsButtonComponent.propTypes = {
    fields: PropTypes.array,
    selectedFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    filter: PropTypes.string,
    subresourceId: PropTypes.string,
    p: polyglotPropTypes.isRequired,
    removeFieldList: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { subresourceId, filter }) => ({
    fields: fromFields.getEditingFields(state, { filter, subresourceId }),
    isFieldsLoading: fromFields.isLoading(state),
});

const mapDispatchToProps = (dispatch) => {
    return {
        removeFieldList: (fields) => {
            dispatch(removeFieldList({ fields }));
        },
    };
};

export const DeleteFieldsButton = compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(DeleteFieldsButtonComponent);
