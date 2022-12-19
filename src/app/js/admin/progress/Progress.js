import React, { useEffect, useState } from 'react';
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
import { io } from 'socket.io-client';

const formatProgress = (progress, target, symbol, label) => {
    const formatedTarget = target ? ` / ${target}` : ``;
    const formatedSymbol = symbol ? ` ${symbol}` : ``;
    const formatedLabel = label ? ` ${label}` : ``;
    return progress + formatedTarget + formatedSymbol + formatedLabel;
};

const renderProgressText = props => {
    const { progress, target, symbol, label, p: polyglot } = props;
    if (!progress) {
        return null;
    }

    return (
        <p>
            {formatProgress(
                progress,
                target,
                symbol,
                label ? polyglot.t(label) : undefined,
            )}
        </p>
    );
};

export const ProgressComponent = props => {
    const { clearProgress, p: polyglot, loadProgress, progress } = props;

    const [updatedProgress, setUpdatedProgress] = useState(progress);
    const isOpen =
        updatedProgress.status !== PENDING && !updatedProgress.isBackground;

    useEffect(() => {
        const socket = io();
        socket.on('progress', data => {
            setUpdatedProgress(data);
        });
        socket.on('connect_error', () => {
            loadProgress();
        });
        return () => socket.disconnect();
    }, []);

    if (updatedProgress.error) {
        return (
            <Dialog open={isOpen} onClose={clearProgress}>
                <DialogTitle>{polyglot.t(updatedProgress.status)}</DialogTitle>
                <DialogContent>
                    <div>{polyglot.t('progress_error')}</div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen}>
            <DialogTitle>{polyglot.t(updatedProgress.status)}</DialogTitle>
            <DialogContent>
                <div className="progress">
                    <LinearProgress
                        variant={
                            updatedProgress.target
                                ? 'determinate'
                                : 'indeterminate'
                        }
                        value={
                            updatedProgress.progress && updatedProgress.target
                                ? (updatedProgress.progress /
                                      updatedProgress.target) *
                                  100
                                : 0
                        }
                    />
                    {renderProgressText({ ...updatedProgress, p: polyglot })}
                </div>
            </DialogContent>
        </Dialog>
    );
};
ProgressComponent.propTypes = {
    progress: PropTypes.shape({
        status: PropTypes.string.isRequired,
        target: PropTypes.number,
        progress: PropTypes.number,
        symbol: PropTypes.string,
        label: PropTypes.string,
        isBackground: PropTypes.bool,
        error: PropTypes.bool,
    }).isRequired,
    loadProgress: PropTypes.func.isRequired,
    clearProgress: PropTypes.func.isRequired,
    p: polyglotPropTypes,
};

ProgressComponent.defaultProps = {
    symbol: null,
    text: null,
    target: null,
};

const mapStateToProps = state => ({
    progress: fromProgress.getProgress(state),
});

const mapDispatchToProps = {
    loadProgress,
    clearProgress,
};

export const Progress = compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(ProgressComponent);
