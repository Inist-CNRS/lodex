// @ts-expect-error TS6133
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from '../../../i18n/I18NContext';
import compose from 'recompose/compose';
import LinkIcon from '@mui/icons-material/Link';
import { TextField } from '@mui/material';
import URL from 'url';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../../propTypes';

import { fromFormat } from '../../../public/selectors';
import { loadFormatData } from '../../reducer';
import Loading from '../../../lib/components/Loading';
import { isURL } from '../../../../../common/uris';
import Link from '../../../lib/components/Link';

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
    input: {
        marginLeft: '2.5%',
        fontSize: '1em',
        width: '12.5%',
        borderImage: 'none',
    },
    link: {
        display: 'inline-block',
        width: '80%',
    },
};

// @ts-expect-error TS7006
const getCreateUrl = (url) => {
    if (typeof url === 'function') {
        return url;
    }
    if (typeof url === 'string') {
        return () => url;
    }

    // @ts-expect-error TS7031
    return ({ field, resource }) => resource[field.name];
};

// @ts-expect-error TS7006
export default (url) => (FormatView) => {
    const createUrl = getCreateUrl(url);

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
            onChange: PropTypes.func.isRequired,
        };

        loadFormatData = () => {
            // @ts-expect-error TS2339
            const { field, loadFormatData } = this.props;
            const value = createUrl(this.props);
            if (!value) {
                return;
            }

            loadFormatData({ field, value });
        };

        componentDidMount() {
            // @ts-expect-error TS2339
            const { field } = this.props;
            if (!field) {
                return;
            }
            this.loadFormatData();
        }

        // @ts-expect-error TS7006
        filterFormatData = (filter) => {
            // @ts-expect-error TS2339
            const { field, loadFormatData } = this.props;
            loadFormatData({
                field,
                value: createUrl(this.props),
                filter,
            });
        };

        redirectIfUrl = () => {
            // @ts-expect-error TS2339
            const { resource, field } = this.props;
            const requestText = resource[field.name];

            if (isURL(requestText)) {
                window.open(requestText);
            }
        };

        ifUrl = () => {
            // @ts-expect-error TS2339
            const { resource, field } = this.props;
            const requestText = resource[field.name];

            if (isURL(requestText)) {
                return (
                    // @ts-expect-error TS2739
                    <Link href={requestText} style={styles.link}>
                        {requestText}
                    </Link>
                );
            }
            return <span> {requestText} </span>;
        };

        getHeaderFormat = () => {
            // @ts-expect-error TS2339
            const { resource, field, sparql } = this.props;
            const requestText = resource[field.name];
            const endpoint = sparql.endpoint.substring(
                sparql.endpoint.search('//') + 2,
            );
            if (!sparql.hiddenInfo) {
                return (
                    <div>
                        <LinkIcon
                            style={
                                isURL(requestText)
                                    ? styles.pointer
                                    : styles.icon
                            }
                            // @ts-expect-error TS2769
                            color="lightGrey"
                            onClick={this.redirectIfUrl}
                        />
                        {this.ifUrl()}
                        <TextField
                            style={styles.input}
                            name="sparqlEnpoint"
                            value={endpoint}
                            variant="standard"
                        />
                    </div>
                );
            }

            return null;
        };

        loadButton2ReloadInHttp = () => {
            // @ts-expect-error TS2339
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
                    {/*
                     // @ts-expect-error TS2739 */}
                    <Link href={url}> {polyglot.t('here')} </Link>
                </p>
            );
        };

        render() {
            const {
                // @ts-expect-error TS2339
                loadFormatData,
                // @ts-expect-error TS2339
                formatData,
                // @ts-expect-error TS2339
                p: polyglot,
                // @ts-expect-error TS2339
                field,
                // @ts-expect-error TS2339
                isLoaded,
                // @ts-expect-error TS2339
                error,
                ...props
            } = this.props;

            if (error) {
                return (
                    <div style={styles.container}>
                        {this.getHeaderFormat()}
                        <p style={styles.message}>
                            {polyglot.t('sparql_error')}
                            {this.loadButton2ReloadInHttp()}
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
                        formatData={formatData}
                        field={field}
                    />
                </div>
            );
        }
    }

    // @ts-expect-error TS2339
    SparqlRequest.WrappedComponent = FormatView;

    // @ts-expect-error TS7006
    const mapStateToProps = (state, { field }) => ({
        // @ts-expect-error TS2339
        formatData: fromFormat.getFormatData(state, field.name),
        // @ts-expect-error TS2339
        isLoaded: field && fromFormat.isFormatDataLoaded(state, field.name),
        // @ts-expect-error TS2339
        error: fromFormat.getFormatError(state, field.name),
    });

    const mapDispatchToProps = {
        loadFormatData,
    };

    return compose(
        connect(mapStateToProps, mapDispatchToProps),
        translate,
        // @ts-expect-error TS2345
    )(SparqlRequest);
};
