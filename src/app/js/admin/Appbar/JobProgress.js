import {
    Box,
    CircularProgress,
    Fade,
    LinearProgress,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import theme from '../../theme';
import { polyglot as polyglotPropTypes } from '../../propTypes';

import PropTypes from 'prop-types';
import { compose } from 'recompose';
import translate from 'redux-polyglot/dist/translate';
import { connect } from 'react-redux';
import { fromProgress, fromPublish } from '../selectors';

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
    const { isPublishing, target, progress, p: polyglot } = props;
    const label = isPublishing && 'publishing';
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
    isPublishing: PropTypes.bool.isRequired,
    target: PropTypes.number,
    progress: PropTypes.number,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
    connect(state => ({
        isPublishing: fromPublish.getIsPublishing(state),
        ...fromProgress.getProgressAndTarget(state),
    })),
)(JobProgressComponent);
