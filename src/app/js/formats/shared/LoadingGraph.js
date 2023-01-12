import React, { Component } from 'react';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { CircularProgress } from '@material-ui/core';
import colorsTheme from '../../../custom/colorsTheme';

class LoadingGraph extends Component {
    static propTypes = {
        polyglot: polyglotPropTypes.isRequired,
    };

    render() {
        const { polyglot } = this.props;

        return (
            <>
                {polyglot.t('loading')}
                <CircularProgress
                    variant="indeterminate"
                    color={colorsTheme.green.primary}
                    size={28}
                />
            </>
        );
    }
}

export default LoadingGraph;
