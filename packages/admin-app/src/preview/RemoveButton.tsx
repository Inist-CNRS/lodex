import { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { removeField } from '../../../../src/app/js/fields';
import CancelButton from '../../../../src/app/js/lib/components/CancelButton';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

interface RemoveButtonComponentProps {
    onRemove(...args: unknown[]): unknown;
    field: unknown;
    filter: string;
}

export const RemoveButtonComponent = ({
    onRemove,
}: RemoveButtonComponentProps) => {
    const { translate } = useTranslate();
    const [showDialog, setShowDialog] = useState(false);

    const handleShowDialog = () => setShowDialog(true);
    const handleCloseDialog = () => setShowDialog(false);

    return (
        <>
            <Button
                variant="contained"
                onClick={handleShowDialog}
                color="warning"
            >
                {translate('remove_from_publication')}
            </Button>
            <Dialog
                open={showDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>{translate('remove_field')}</DialogTitle>
                <DialogActions>
                    <CancelButton onClick={handleCloseDialog}>
                        {translate('Cancel')}
                    </CancelButton>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={onRemove}
                    >
                        {translate('Accept')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

// @ts-expect-error TS7006
const mapDispatchtoProps = (dispatch, { field, filter }) =>
    bindActionCreators(
        {
            onRemove: () => removeField({ field, filter }),
        },
        dispatch,
    );

export default compose(
    connect(undefined, mapDispatchtoProps),
    // @ts-expect-error TS2345
)(RemoveButtonComponent);
