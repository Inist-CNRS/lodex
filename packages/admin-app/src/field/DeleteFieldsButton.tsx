import { Delete as DeleteIcon } from '@mui/icons-material';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { removeFieldList } from '@lodex/frontend-common/fields/reducer';
import FieldRepresentation from '../../../../src/app/js/fields/FieldRepresentation';
import { fromFields } from '@lodex/frontend-common/sharedSelectors';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import type { Field } from '../../../../src/app/js/fields/types';

interface DeleteFieldsButtonComponentProps {
    fields?: (Field & {
        _id: string;
    })[];
    selectedFields: string[];
    isFieldsLoading: boolean;
    filter?: string;
    subresourceId?: string;
    removeFieldList(...args: unknown[]): unknown;
    dispatch(...args: unknown[]): unknown;
    isRemoveFieldListPending?: boolean;
}

const DeleteFieldsButtonComponent = ({
    fields,
    isRemoveFieldListPending,
    isFieldsLoading,
    selectedFields,
    removeFieldList,
}: DeleteFieldsButtonComponentProps) => {
    const { translate } = useTranslate();
    const [warningOpen, setWarningOpen] = useState(false);

    const fieldsToDelete = useMemo(() => {
        if (selectedFields.length === 0) {
            return [];
        }

        // @ts-expect-error TS7031
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

    const isLoading = isFieldsLoading || isRemoveFieldListPending;

    return (
        <>
            {fieldsToDelete.length > 0 && (
                <Button
                    variant="outlined"
                    color="primary"
                    disabled={isLoading}
                    startIcon={
                        isLoading ? (
                            <CircularProgress color="primary" size="1em" />
                        ) : (
                            <DeleteIcon />
                        )
                    }
                    onClick={handleOpenModal}
                    aria-label={translate('delete_selected_fields')}
                >
                    {translate('delete_selected_fields')}
                </Button>
            )}
            <Dialog
                open={warningOpen}
                onClose={handleCloseModal}
                aria-labelledby="delete-selected-fields-dialog-title"
                aria-describedby="delete-selected-fields-dialog-description"
            >
                <DialogTitle id="delete-selected-fields-dialog-title">
                    {translate('delete_selected_fields_title', {
                        smart_count: fieldsToDelete.length,
                    })}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {translate('delete_selected_fields_helptext', {
                            smart_count: fieldsToDelete.length,
                        })}
                    </DialogContentText>
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
                        aria-label={translate('cancel')}
                    >
                        {translate('cancel')}
                    </Button>
                    <Button
                        onClick={handleDeleteFields}
                        variant="contained"
                        color="primary"
                        autoFocus
                        aria-label={translate('delete')}
                    >
                        {translate('delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { subresourceId, filter }) => ({
    isRemoveFieldListPending: fromFields.isRemoveFieldListPending(state),
    fields: fromFields.getEditingFields(state, { filter, subresourceId }),
    isFieldsLoading: fromFields.isLoading(state),
});

// @ts-expect-error TS7006
const mapDispatchToProps = (dispatch) => {
    return {
        // @ts-expect-error TS7006
        removeFieldList: (fields) => {
            dispatch(removeFieldList({ fields }));
        },
    };
};

export const DeleteFieldsButton = compose(
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(DeleteFieldsButtonComponent);
