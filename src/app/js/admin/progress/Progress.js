import React, { Component } from 'react';
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

export class ProgressComponent extends Component {
    UNSAFE_componentWillMount() {
        this.props.loadProgress();
    }

    renderProgressText = () => {
        const { progress, target, symbol } = this.props;

        if (!progress || !target) {
            return null;
        }

        if (symbol) {
            return (
                <p>
                    {progress} / {target} {symbol}
                </p>
            );
        }

        return (
            <p>
                {progress} / {target}
            </p>
        );
    };

    render() {
        const {
            status,
            target,
            progress,
            error,
            clearProgress,
            p: polyglot,
        } = this.props;

        if (error) {
            return (
                <Dialog open={status !== PENDING} onClose={clearProgress}>
                    <DialogTitle>{polyglot.t(status)}</DialogTitle>
                    <DialogContent>
                        <div>{polyglot.t('progress_error')}</div>
                    </DialogContent>
                </Dialog>
            );
        }

        return (
            <Dialog open={status !== PENDING}>
                <DialogTitle>{polyglot.t(status)}</DialogTitle>
                <DialogContent>
                    <div className="progress">
                        <LinearProgress
                            mode="determinate"
                            min={0}
                            max={target || 0}
                            value={progress || 0}
                        />
                        {this.renderProgressText()}
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
}

ProgressComponent.propTypes = {
    status: PropTypes.string.isRequired,
    target: PropTypes.number,
    progress: PropTypes.number,
    symbol: PropTypes.string,
    loadProgress: PropTypes.func.isRequired,
    error: PropTypes.bool,
    clearProgress: PropTypes.func.isRequired,
    p: polyglotPropTypes,
};

ProgressComponent.defaultProps = {
    symbol: null,
};

const mapStateToProps = state => ({
    ...fromProgress.getProgress(state),
});

const mapDispatchToProps = {
    loadProgress,
    clearProgress,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(ProgressComponent);
