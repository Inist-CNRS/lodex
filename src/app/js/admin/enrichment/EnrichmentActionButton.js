import React, { useContext } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import {
    PlayArrow as PlayArrowIcon,
    Delete as DeleteIcon,
} from '@material-ui/icons';
import { Button, makeStyles } from '@material-ui/core';
import {
    PENDING,
    FINISHED,
    IN_PROGRESS,
} from '../../../../common/enrichmentStatus';
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
    const {
        handleLaunchEnrichment,
        handleDeleteEnrichment,
        isEdit,
        enrichment,
    } = useContext(EnrichmentContext);
    return (
        <div className={classes.actionContainer}>
            {[PENDING, IN_PROGRESS, FINISHED].includes(enrichment?.status) && (
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
            )}

            {isEdit && (
                <Button
                    variant="contained"
                    key="delete"
                    name="delete-enrichment"
                    color="secondary"
                    onClick={handleDeleteEnrichment}
                    style={{ marginLeft: 24 }}
                >
                    <DeleteIcon className={classes.icon} />
                    {polyglot.t('delete')}
                </Button>
            )}
        </div>
    );
};

EnrichmentActionButtonComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default compose(translate)(EnrichmentActionButtonComponent);
