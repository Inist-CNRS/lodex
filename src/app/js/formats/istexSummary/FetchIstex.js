import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';

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

class FetchIstex extends Component {
    state = {
        data: null,
        error: null,
        isLoading: true,
    };

    componentWillMount() {
        this.props
            .getData()
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
        const { error, data, isLoading } = this.state;

        if (error) {
            return <AdminOnlyAlert>{polyglot.t('istex_error')}</AdminOnlyAlert>;
        }

        if (isLoading) {
            return circularProgress;
        }
        return children({ ...this.props, data });
    }
}

FetchIstex.propTypes = {
    polyglot: polyglotPropTypes.isRequired,
    getData: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
};

export default FetchIstex;
