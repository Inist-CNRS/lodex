import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core';

import { removeField } from '../../fields';

import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../../propTypes';

export const RemoveButtonComponent = ({ onRemove, p: polyglot }) => {
    const [showDialog, setShowDialog] = useState(false);

    const handleShowDialog = () => setShowDialog(true);
    const handleCloseDialog = () => setShowDialog(false);

    return (
        <>
            <Button variant="text" onClick={handleShowDialog} color="secondary">
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
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={onRemove}
                    >
                        {polyglot.t('Accept')}
                    </Button>
                    <Button
                        color="secondary"
                        variant="text"
                        onClick={handleCloseDialog}
                    >
                        {polyglot.t('Cancel')}
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
