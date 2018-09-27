import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import { connect } from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';

import { fromProgress } from '../selectors';
import { loadProgress } from './reducer';
import { PENDING } from '../../../../common/progressStatus';
import { polyglot as polyglotPropTypes } from '../../propTypes';

export class Progress extends Component {
    componentWillMount() {
        this.props.loadProgress();
    }
    render() {
        const { status, target, progress, p: polyglot } = this.props;
        return (
            <Dialog
                title={polyglot.t(status)}
                actions={[]}
                modal={false}
                open={status !== PENDING}
            >
                <div className="progress">
                    <LinearProgress
                        mode={target && progress && 'determinate'}
                        min={0}
                        max={target}
                        value={progress}
                    />
                    {progress &&
                        target && (
                            <p>
                                {progress} / {target}
                            </p>
                        )}
                </div>
            </Dialog>
        );
    }
}

Progress.propTypes = {
    status: PropTypes.string.isRequired,
    target: PropTypes.number.isRequired,
    progress: PropTypes.number.isRequired,
    loadProgress: PropTypes.func.isRequired,
    p: polyglotPropTypes,
};

const mapStateToProps = state => ({
    ...fromProgress.getProgress(state),
});

const mapDispatchToProps = {
    loadProgress,
};

export default compose(translate, connect(mapStateToProps, mapDispatchToProps))(
    Progress,
);
