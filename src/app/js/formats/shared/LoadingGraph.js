import React, { Component } from 'react';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { CircularProgress } from '@mui/material';

class LoadingGraph extends Component {
    static propTypes = {
        polyglot: polyglotPropTypes.isRequired,
    };

    render() {
        const { polyglot } = this.props;

        return (
            <>
                {polyglot.t('loading')}
                <CircularProgress variant="indeterminate" size={28} />
            </>
        );
    }
}

export default LoadingGraph;
