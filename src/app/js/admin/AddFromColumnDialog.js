import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../propTypes';
import ParsingResult from './parsing/ParsingResult';

const styles = {
    container: {
        display: 'flex',
        padding: '1rem',
        width: 1000,
    },
    dialogContent: {
        height: 'calc(90vh - 64px - 52px)',
    },
};

export const AddFromColumnDialogComponent = ({ p: polyglot, onClose }) => {
    return (
        <Dialog open onClose={onClose} maxWidth="xl">
            <DialogTitle> {polyglot.t('a_column')}</DialogTitle>
            <DialogContent style={styles.dialogContent}>
                <div style={styles.container}>
                    <ParsingResult
                        showAddFromColumn
                        maxLines={6}
                        onAddField={onClose}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" variant="text" onClick={onClose}>
                    {polyglot.t('Cancel')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AddFromColumnDialogComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default translate(AddFromColumnDialogComponent);
