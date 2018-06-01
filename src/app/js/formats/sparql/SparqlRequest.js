import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import URL from 'url';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes.js';
import Loading from '../../lib/components/Loading';
import ActionSearch from 'material-ui/svg-icons/action/search';
import TextField from 'material-ui/TextField';
import { isURL } from '../../../../common/uris.js';

const styles = {
    message: {
        margin: 20,
    },
    icon: {
        cursor: 'default',
        verticalAlign: 'middle',
        width: '5%',
    },
    pointer: {
        cursor: 'pointer',
        verticalAlign: 'middle',
        width: '5%',
    },
    container: {
        display: 'block',
        width: '100%',
    },
    input1: {
        fontSize: '1em',
        width: '80%',
        borderImage: 'none',
    },
    input2: {
        marginLeft: '2.5%',
        fontSize: '1em',
        width: '12.5%',
        borderImage: 'none',
    },
};

export default url => FormatView => {
    console.log(url());//eslint-disable-line

    class SparqlRequest extends Component {
        static propTypes = {
            field: fieldPropTypes.isRequired,
            resource: PropTypes.object.isRequired,
            loadFormatData: PropTypes.func.isRequired,
            formatData: PropTypes.any,
            isLoaded: PropTypes.bool.isRequired,
            error: PropTypes.object,
            p: polyglotPropTypes.isRequired,
            sparql: PropTypes.object,
        };

        redirectIfUrl = () => {
            const { resource, field } = this.props;
            const requestText = resource[field.name];

            if (isURL(requestText)) {
                window.open(requestText);
            }
        };

        getHeaderFormat = () => {
            const { resource, field, sparql } = this.props;
            const requestText = resource[field.name];
            let endpoint = sparql.endpoint.substring(
                sparql.endpoint.search('//') + 2,
            );
            if (!sparql.hiddenInfo) {
                return (
                    <div>
                        <ActionSearch
                            style={
                                isURL(requestText)
                                    ? styles.pointer
                                    : styles.icon
                            }
                            color="lightGrey"
                            onClick={this.redirectIfUrl}
                        />
                        <TextField
                            style={styles.input1}
                            name="sparqlRequest"
                            value={requestText}
                        />
                        <TextField
                            style={styles.input2}
                            name="sparqlEnpoint"
                            value={endpoint}
                        />
                    </div>
                );
            }

            return null;
        };

        loadButton2ReloadInHttp = () => {
            const { p: polyglot } = this.props;
            const source = URL.parse(window.location.href);
            if (source.protocol == 'http:') {
                return null;
            }
            const target = {
                protocol: 'http:',
                hostname: source.hostname,
                slashes: source.slashes,
                port: source.port,
                pathname: source.pathname,
                search: source.search,
            };
            const url = URL.format(target);
            return (
                <p>
                    {polyglot.t('sparql_http_retry')}
                    <a href={url}> {polyglot.t('here')} </a>
                </p>
            );
        };

        render() {
            const {
                loadFormatData,
                formatData,
                p: polyglot,
                field,
                isLoaded,
                error,
                ...props
            } = this.props;

            if (error) {
                return (
                    <div style={styles.container}>
                        {this.getHeaderFormat()}
                        <p style={styles.message}>
                            {polyglot.t('sparql_error')}
                        </p>
                    </div>
                );
            }

            if (formatData != undefined) {
                if (formatData.results.bindings.length == 0) {
                    return (
                        <div style={styles.container}>
                            {this.getHeaderFormat()}
                            <p style={styles.message}>
                                {polyglot.t('sparql_data')}
                            </p>
                        </div>
                    );
                }
            }

            return (
                <div>
                    {this.getHeaderFormat()}
                    {!isLoaded && <Loading>{polyglot.t('loading')}</Loading>}
                    <FormatView
                        {...props}
                        formatData={formatData /*injection dans le props ici*/}
                        field={field}
                    />
                </div>
            );
        }
    }

    SparqlRequest.WrappedComponent = FormatView;

    return compose(translate)(SparqlRequest);
};
