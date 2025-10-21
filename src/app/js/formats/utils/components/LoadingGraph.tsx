import { Component } from 'react';
import { CircularProgress } from '@mui/material';

interface LoadingGraphProps {
    polyglot: unknown;
}

class LoadingGraph extends Component<LoadingGraphProps> {
    render() {
        const { polyglot } = this.props;

        return (
            <>
                {/*
                 // @ts-expect-error TS18046 */}
                {polyglot.t('loading')}
                <CircularProgress variant="indeterminate" size={28} />
            </>
        );
    }
}

export default LoadingGraph;
