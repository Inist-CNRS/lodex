import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import AdminOnlyAlert from '../../lib/components/AdminOnlyAlert';

const circularProgress = (
    <CircularProgress
        size={20}
        innerStyle={{
            display: 'flex',
            marginLeft: 8,
        }}
    />
);

class SkipFold extends Component {
    state = {
        data: null,
        error: null,
        isLoading: true,
    };

    UNSAFE_componentWillMount() {
        this.props
            .getData(this.props)
            .then(data => {
                this.setState({
                    data,
                    isLoading: false,
                    isOpen: true,
                });
            })
            .catch(error => {
                console.error(error);
                this.setState({ error: true, isLoading: false });
            });
    }

    render() {
        const { polyglot, children } = this.props;
        const { data, isLoading, error } = this.state;

        if (error) {
            return <AdminOnlyAlert>{polyglot.t('istex_error')}</AdminOnlyAlert>;
        }

        if (isLoading) {
            return circularProgress;
        }

        if (!data.hits.length) {
            return null;
        }

        return children({ ...this.props, data });
    }
}

SkipFold.propTypes = {
    children: PropTypes.func.isRequired,
    polyglot: polyglotPropTypes.isRequired,
    getData: PropTypes.func.isRequired,
};

export default SkipFold;
