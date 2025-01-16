import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

import { removeField } from '../../fields';

import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../../propTypes';
import CancelButton from '../../lib/components/CancelButton';

export const RemoveButtonComponent = ({ onRemove, p: polyglot }) => {
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
                {polyglot.t('remove_from_publication')}
            </Button>
            <Dialog
                open={showDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>{polyglot.t('remove_field')}</DialogTitle>
                <DialogActions>
                    <CancelButton onClick={handleCloseDialog}>
                        {polyglot.t('Cancel')}
                    </CancelButton>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={onRemove}
                    >
                        {polyglot.t('Accept')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

RemoveButtonComponent.propTypes = {
    onRemove: PropTypes.func.isRequired,
    field: fieldPropTypes.isRequired,
    filter: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
};

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
)(RemoveButtonComponent);
