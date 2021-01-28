import React from 'react';
import translate from 'redux-polyglot/translate';
import { Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { compose, withState } from 'recompose';

export const DeleteSubresourceButton = compose(
    translate,
    withState('showDeletePopup', 'setShowDeletePopup', false),
)(({ p: polyglot, onClick, showDeletePopup, setShowDeletePopup }) => (
    <>
        <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowDeletePopup(true)}
        >
            {polyglot.t('delete')}
        </Button>
        {showDeletePopup && (
            <Dialog open>
                <DialogTitle>
                    {polyglot.t('confirm_delete_subresource')}
                </DialogTitle>
                <DialogContent>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={onClick}
                    >
                        OK
                    </Button>
                </DialogContent>
            </Dialog>
        )}
    </>
));
