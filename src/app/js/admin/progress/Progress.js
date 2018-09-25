import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import { connect } from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';

import { fromProgress } from '../selectors';

export const Progress = ({ status, target, progress }) => (
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

Progress.propTypes = {
    status: PropTypes.string.isRequired,
    target: PropTypes.number.isRequired,
    progress: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
    ...fromProgress.getProgress(state),
});

export default connect(mapStateToProps)(Progress);
