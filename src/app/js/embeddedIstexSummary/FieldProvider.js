import React, { Component } from 'react';
import PropTypes from 'prop-types';

import fetch from '../lib/fetch';
import { getYearUrl } from '../formats/istexSummary/getIstexData';
import { CUSTOM_ISTEX_QUERY } from '../formats/istexSummary/constants';

class FieldProvider extends Component {
    state = {
        error: null,
        loading: true,
        data: null,
    };

    getFirstIstexQuery = () => {
        const { data } = this.state;
        const { field, resource } = data;
        const searchedField =
            field.format.args.searchedField || CUSTOM_ISTEX_QUERY;

        fetch({
            url: getYearUrl({
                resource,
                field,
                searchedField,
            }),
        }).then(({ error, response }) => {
            if (error) {
                this.setState({ error: true });
                return;
            }

            this.setState({
                loading: false,
                data: {
                    ...data,
                    formatData: response,
                },
            });
        });
    };

    componentDidMount() {
        const { api, uri, fieldName } = this.props;

        fetch({
            url: `${api}/embedded?uri=${encodeURIComponent(
                uri,
            )}&fieldName=${encodeURIComponent(fieldName)}`,
        }).then(({ error, response }) => {
            if (error) {
                this.setState({ error: true });
                return;
            }

            this.setState(
                {
                    data: {
                        ...response,
                        resource: { [response.field.name]: response.value },
                    },
                },
                this.getFirstIstexQuery,
            );
        });
    }

    render() {
        const { children } = this.props;
        const { error, loading, data } = this.state;

        if (loading || error || !data) {
            return null;
        }

        return children(data);
    }
}

FieldProvider.propTypes = {
    children: PropTypes.func.isRequired,
    api: PropTypes.string.isRequired,
    uri: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
};

export default FieldProvider;
