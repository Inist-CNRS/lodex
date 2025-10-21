import { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { removeField } from '../../fields';
import CancelButton from '../../lib/components/CancelButton';
import { translate } from '../../i18n/I18NContext';

interface RemoveButtonComponentProps {
    onRemove(...args: unknown[]): unknown;
    field: unknown;
    filter: string;
    p: unknown;
}

export const RemoveButtonComponent = ({
    onRemove,
    p: polyglot,
}: RemoveButtonComponentProps) => {
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
                {/*
                 // @ts-expect-error TS18046 */}
                {polyglot.t('remove_from_publication')}
            </Button>
            <Dialog
                open={showDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                {/*
                 // @ts-expect-error TS18046 */}
                <DialogTitle>{polyglot.t('remove_field')}</DialogTitle>
                <DialogActions>
                    <CancelButton onClick={handleCloseDialog}>
                        {/*
                         // @ts-expect-error TS18046 */}
                        {polyglot.t('Cancel')}
                    </CancelButton>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={onRemove}
                    >
                        {/*
                         // @ts-expect-error TS18046 */}
                        {polyglot.t('Accept')}
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
    translate,
    // @ts-expect-error TS2345
)(RemoveButtonComponent);
