import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    LinearProgress,
    DialogTitle,
    DialogContent,
} from '@material-ui/core';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';

import { fromProgress } from '../selectors';
import { loadProgress, clearProgress } from './reducer';
import { PENDING } from '../../../../common/progressStatus';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const renderProgressText = props => {
    const { progress, target, symbol, label } = props;
    if (!progress) {
        return null;
    }

    return (
        <p>
            {`${progress}${target ? ` / ${target}` : ''}${
                symbol ? ` ${symbol}` : ''
            }${label ? ` ${label}` : ''}`}
        </p>
    );
};

export const ProgressComponent = props => {
    const {
        status,
        target,
        label,
        progress,
        error,
        clearProgress,
        p: polyglot,
        loadProgress,
        isBackground,
    } = props;

    const isOpen = status !== PENDING && !isBackground;
    useEffect(() => {
        loadProgress();
    }, []);

    if (error) {
        return (
            <Dialog open={isOpen} onClose={clearProgress}>
                <DialogTitle>{polyglot.t(status)}</DialogTitle>
                <DialogContent>
                    <div>{polyglot.t('progress_error')}</div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen}>
            <DialogTitle>{polyglot.t(status)}</DialogTitle>
            <DialogContent>
                <div className="progress">
                    <LinearProgress
                        mode="determinate"
                        min={0}
                        max={target || 0}
                        value={progress || 0}
                    />
                    {renderProgressText(props)}
                </div>
            </DialogContent>
        </Dialog>
    );
};
ProgressComponent.propTypes = {
    status: PropTypes.string.isRequired,
    target: PropTypes.number,
    progress: PropTypes.number,
    symbol: PropTypes.string,
    loadProgress: PropTypes.func.isRequired,
    error: PropTypes.bool,
    clearProgress: PropTypes.func.isRequired,
    p: polyglotPropTypes,
    isBackground: PropTypes.bool,
    label: PropTypes.string,
};

ProgressComponent.defaultProps = {
    symbol: null,
    text: null,
    target: null,
};

const mapStateToProps = state => ({
    ...fromProgress.getProgress(state),
});

const mapDispatchToProps = {
    loadProgress,
    clearProgress,
};

export const Progress = compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(ProgressComponent);
