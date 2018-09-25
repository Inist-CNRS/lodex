import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import { connect } from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';

import { fromProgress } from '../selectors';
import { loadProgress } from './reducer';

export class Progress extends Component {
    componentWillMount() {
        this.props.loadProgress();
    }
    render() {
        const { status, target, progress } = this.props;
        return (
            <Dialog
                title="progress"
                actions={[]}
                modal={false}
                open={status !== 'pending'}
            >
                <div>
                    <p>{status}</p>
                    <LinearProgress
                        mode="determinate"
                        min={0}
                        max={target}
                        value={progress}
                    />
                    {progress} / {target}
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
};

const mapStateToProps = state => ({
    ...fromProgress.getProgress(state),
});

const mapDispatchToProps = {
    loadProgress,
};

export default connect(mapStateToProps, mapDispatchToProps)(Progress);
