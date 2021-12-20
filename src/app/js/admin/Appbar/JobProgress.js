import {
    Box,
    CircularProgress,
    Fade,
    LinearProgress,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import theme from '../../theme';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { io } from 'socket.io-client';
import translate from 'redux-polyglot/dist/translate';
import { publishSuccess } from '../publish';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { PENDING } from '../../../../common/progressStatus';

const useStyles = makeStyles({
    progress: {
        width: '100%',
        display: 'flex',
        margin: '0 4px 0',
    },
    colorPrimary: { backgroundColor: theme.green.secondary },
    barColorPrimary: { backgroundColor: theme.white.primary },
    progressContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginLeft: 'auto',
        width: '200px',
        marginRight: '20px',
    },
    progressLabelContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    progressLabel: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
});

const JobProgressComponent = props => {
    const classes = useStyles();
    const { p: polyglot, handlePublishSuccess } = props;
    const [dataJobProgress, setDataJobProgress] = useState({});
    const [progress, setProgress] = useState();

    useEffect(() => {
        const socket = io();
        socket.on('progress', data => {
            if (data.status === PENDING) {
                return;
            }
            setProgress(data);
        });
        socket.on('publisher', data => {
            setDataJobProgress({
                isJobProgress: data.isPublishing,
                type: 'publisher',
                label: 'publishing',
            });
            if (data.success) {
                handlePublishSuccess();
            }
        });
        socket.on('enrichment', data => {
            setDataJobProgress({
                isJobProgress: data.isEnriching,
                type: 'enrichment',
                label: 'enriching',
                name: data.name,
            });
        });
        return () => socket.disconnect();
    }, []);

    return (
        <Fade
            in={dataJobProgress?.isJobProgress}
            out={!dataJobProgress?.isJobProgress}
        >
            <Box className={classes.progressContainer}>
                <div className={classes.progressLabelContainer}>
                    <CircularProgress
                        variant="indeterminate"
                        color="inherit"
                        size={20}
                    />
                    <div className={classes.progressLabel}>
                        {dataJobProgress?.label && (
                            <Typography variant="subtitle2">
                                {polyglot.t(
                                    dataJobProgress?.label || 'publishing',
                                )}
                            </Typography>
                        )}
                        {progress &&
                            dataJobProgress?.type === 'publisher' &&
                            progress.status && (
                                <Typography variant="caption">
                                    {polyglot.t(progress.status)}
                                </Typography>
                            )}

                        {dataJobProgress?.type === 'enrichment' && (
                            <Typography variant="caption">
                                {dataJobProgress.name}
                            </Typography>
                        )}
                    </div>
                </div>
                <LinearProgress
                    classes={{
                        root: classes.progress,
                        colorPrimary: classes.colorPrimary,
                        barColorPrimary: classes.barColorPrimary,
                    }}
                    variant="determinate"
                    value={
                        progress && progress.target
                            ? (progress.progress / progress.target) * 100
                            : 0
                    }
                />
            </Box>
        </Fade>
    );
};
JobProgressComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    handlePublishSuccess: PropTypes.func.isRequired,
};
const mapDispatchToProps = {
    handlePublishSuccess: () => publishSuccess(),
};
export default compose(
    connect(undefined, mapDispatchToProps),
    translate,
)(JobProgressComponent);
