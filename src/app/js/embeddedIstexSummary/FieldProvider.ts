import { Component } from 'react';
import PropTypes from 'prop-types';

import fetch from '../lib/fetch';
import { getYearUrl } from '../formats/other/istexSummary/getIstexData';
import { CUSTOM_ISTEX_QUERY } from '../formats/other/istexSummary/constants';

class FieldProvider extends Component {
    state = {
        error: null,
        loading: true,
        data: null,
    };

    getFirstIstexQuery = () => {
        const { data } = this.state;
        // @ts-expect-error TS2339
        const { field, resource } = data;
        const searchedField =
            field.format.args.searchedField || CUSTOM_ISTEX_QUERY;

        fetch({
            url: getYearUrl({
                resource,
                field,
                searchedField,
            }),
            // @ts-expect-error TS7031
        }).then(({ error, response }) => {
            if (error) {
                this.setState({ error: true });
                return;
            }

            this.setState({
                loading: false,
                data: {
                    // @ts-expect-error TS2698
                    ...data,
                    formatData: response,
                },
            });
        });
    };

    componentDidMount() {
        // @ts-expect-error TS2339
        const { api, uri, fieldName } = this.props;

        fetch({
            url: `${api}/embedded?uri=${encodeURIComponent(
                uri,
            )}&fieldName=${encodeURIComponent(fieldName)}`,
            // @ts-expect-error TS7031
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

        // @ts-expect-error TS2349
        return children(data);
    }
}

// @ts-expect-error TS2339
FieldProvider.propTypes = {
    children: PropTypes.func.isRequired,
    api: PropTypes.string.isRequired,
    uri: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
};

export default FieldProvider;
