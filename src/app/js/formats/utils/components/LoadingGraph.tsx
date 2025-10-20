// @ts-expect-error TS6133
import React, { Component } from 'react';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { CircularProgress } from '@mui/material';

interface LoadingGraphProps {
    polyglot: unknown;
}

class LoadingGraph extends Component<LoadingGraphProps> {
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
