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

const useStyles = makeStyles({
    progress: {
        width: '100%',
        display: 'flex',
        margin: '0 4px 0',
    },
    colorPrimary: { backgroundColor: theme.white.primary },
    barColorPrimary: { backgroundColor: theme.green.secondary },
    progressContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginLeft: 'auto',
        width: '130px',
        marginRight: '20px',
    },
    progressLabel: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
});

const JobProgressComponent = props => {
    const classes = useStyles();
    const { p: polyglot } = props;
    const [isPublishing, setIsPublishing] = useState(false);
    const [progress, setProgress] = useState();
    const [target, setTarget] = useState();
    const label = isPublishing && 'publishing';
    useEffect(() => {
        const socket = io();
        socket.on('progress', data => {
            setTarget(data.target);
            setProgress(data.progress);
        });
        socket.on('publisher', data => {
            setIsPublishing(data.isPublishing);
        });
        return () => socket.disconnect();
    }, []);
    return (
        <Fade in={isPublishing} out={!isPublishing}>
            <Box className={classes.progressContainer}>
                <div className={classes.progressLabel}>
                    <CircularProgress
                        variant="indeterminate"
                        color="inherit"
                        size={20}
                    />
                    {label && <Typography>{polyglot.t(label)}</Typography>}
                </div>
                <LinearProgress
                    classes={{
                        root: classes.progress,
                        colorPrimary: classes.colorPrimary,
                        barColorPrimary: classes.barColorPrimary,
                    }}
                    variant="determinate"
                    value={target ? (progress / target) * 100 : 0}
                />
            </Box>
        </Fade>
    );
};

JobProgressComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(JobProgressComponent);
