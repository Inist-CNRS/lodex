import React, { Component, Fragment } from 'react';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import CircularProgress from 'material-ui/CircularProgress';
import theme from '../../theme';

class LoadingGraph extends Component {
    static propTypes = {
        polyglot: polyglotPropTypes.isRequired,
    };

    render() {
        const { polyglot } = this.props;

        return (
            <Fragment>
                {polyglot.t('loading')}
                <CircularProgress color={theme.green.primary} size={28} />
            </Fragment>
        );
    }
}

export default LoadingGraph;
