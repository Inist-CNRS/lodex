import React from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
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

const useStyles = makeStyles({
    actionContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: 20,
    },
});

export const EnrichmentActionButtonComponent = ({
    handleLaunchEnrichment,
    handleDeleteEnrichment,
    isEdit,
    p: polyglot,
    status,
}) => {
    const classes = useStyles();
    return (
        <div className={classes.actionContainer}>
            {[PENDING, IN_PROGRESS, FINISHED].includes(status) && (
                <Button
                    onClick={handleLaunchEnrichment}
                    variant="contained"
                    color="primary"
                    key="run"
                    name="run-enrichment"
                    disabled={[IN_PROGRESS].includes(status)}
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
    handleDeleteEnrichment: PropTypes.func.isRequired,
    handleLaunchEnrichment: PropTypes.func.isRequired,
    isEdit: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
    status: PropTypes.any,
};

export default compose(translate)(EnrichmentActionButtonComponent);
