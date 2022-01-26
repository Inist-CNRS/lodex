import React, { useContext, useState } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import {
    PlayArrow as PlayArrowIcon,
    Delete as DeleteIcon,
} from '@material-ui/icons';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    makeStyles,
} from '@material-ui/core';
import { IN_PROGRESS } from '../../../../common/enrichmentStatus';
import { EnrichmentContext } from './EnrichmentContext';

const useStyles = makeStyles({
    actionContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: 20,
    },
});

export const EnrichmentActionButtonComponent = ({ p: polyglot }) => {
    const classes = useStyles();
    const [showDialog, setShowDialog] = useState(false);

    const handleShowDialog = () => setShowDialog(true);
    const handleCloseDialog = () => setShowDialog(false);
    const {
        handleLaunchEnrichment,
        handleDeleteEnrichment,
        isEdit,
        enrichment,
    } = useContext(EnrichmentContext);
    return (
        <div className={classes.actionContainer}>
            <Button
                onClick={handleLaunchEnrichment}
                variant="contained"
                color="primary"
                key="run"
                name="run-enrichment"
                disabled={[IN_PROGRESS].includes(enrichment?.status)}
            >
                <PlayArrowIcon className={classes.icon} />
                {polyglot.t('run')}
            </Button>

            {isEdit && (
                <>
                    <Button
                        variant="contained"
                        key="delete"
                        name="delete-enrichment"
                        color="secondary"
                        onClick={handleShowDialog}
                        style={{ marginLeft: 24 }}
                    >
                        <DeleteIcon className={classes.icon} />
                        {polyglot.t('delete')}
                    </Button>
                    <Dialog
                        open={showDialog}
                        onClose={handleCloseDialog}
                        maxWidth="sm"
                        fullWidth
                    >
                        <DialogTitle>
                            {polyglot.t('remove_enrichment_dialog_title')}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {polyglot.t(
                                    'remove_enrichment_dialog_content',
                                ) + ` "${enrichment?.name}".`}
                            </DialogContentText>
                            <DialogContentText>
                                {polyglot.t(
                                    'remove_enrichment_dialog_content_2',
                                )}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={e => {
                                    handleCloseDialog();
                                    handleDeleteEnrichment(e);
                                }}
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
            )}
        </div>
    );
};

EnrichmentActionButtonComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default compose(translate)(EnrichmentActionButtonComponent);
