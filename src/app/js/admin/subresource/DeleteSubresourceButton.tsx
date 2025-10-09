import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
import CancelButton from '../../lib/components/CancelButton';
import { useTranslate } from '../../i18n/I18NContext';
import { useState } from 'react';

export const DeleteSubresourceButton = ({
    onClick,
}: {
    onClick: () => void;
}) => {
    const { translate } = useTranslate();
    const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
    return (
        <>
            <Button
                variant="contained"
                color="warning"
                onClick={() => setShowDeletePopup(true)}
            >
                {translate('delete')}
            </Button>
            {showDeletePopup && (
                <Dialog open onClose={() => setShowDeletePopup(false)}>
                    <DialogTitle>
                        {translate('confirm_delete_subresource')}
                    </DialogTitle>
                    <DialogActions>
                        <CancelButton onClick={() => setShowDeletePopup(false)}>
                            {translate('cancel')}
                        </CancelButton>
                        <Button
                            color="warning"
                            variant="contained"
                            onClick={onClick}
                        >
                            {translate('delete')}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};
