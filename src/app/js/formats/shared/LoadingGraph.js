import React, { Component } from 'react';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import CircularProgress from '@material-ui/core/CircularProgress';
import theme from '../../theme';

class LoadingGraph extends Component {
    static propTypes = {
        polyglot: polyglotPropTypes.isRequired,
    };

    render() {
        const { polyglot } = this.props;

        return (
            <>
                {polyglot.t('loading')}
                <CircularProgress color={theme.green.primary} size={28} />
            </>
        );
    }
}

export default LoadingGraph;
