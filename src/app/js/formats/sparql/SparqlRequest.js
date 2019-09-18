import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import URL from 'url';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes.js';
import { fromFormat } from '../../public/selectors';
import { loadFormatData } from '../../formats/reducer';
import Loading from '../../lib/components/Loading';
import LinkIcon from '@material-ui/icons/Link';
import TextField from 'material-ui/TextField';
import { isURL } from '../../../../common/uris.js';
import Link from '../../lib/components/Link';

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

const getCreateUrl = url => {
    if (typeof url === 'function') {
        return url;
    }
    if (typeof url === 'string') {
        return () => url;
    }

    return ({ field, resource }) => resource[field.name];
};

export default url => FormatView => {
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
            const { field, loadFormatData } = this.props;
            const value = createUrl(this.props);
            if (!value) {
                return;
            }

            loadFormatData({ field, value });
        };

        componentDidMount() {
            const { field } = this.props;
            if (!field) {
                return;
            }
            this.loadFormatData();
        }

        filterFormatData = filter => {
            const { field, loadFormatData } = this.props;
            loadFormatData({
                field,
                value: createUrl(this.props),
                filter,
            });
        };

        redirectIfUrl = () => {
            const { resource, field } = this.props;
            const requestText = resource[field.name];

            if (isURL(requestText)) {
                window.open(requestText);
            }
        };

        ifUrl = () => {
            const { resource, field } = this.props;
            const requestText = resource[field.name];

            if (isURL(requestText)) {
                return (
                    <Link href={requestText} style={styles.link}>
                        {requestText}
                    </Link>
                );
            }
            return <span> {requestText} </span>;
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
                        <LinkIcon
                            style={
                                isURL(requestText)
                                    ? styles.pointer
                                    : styles.icon
                            }
                            color="lightGrey"
                            onClick={this.redirectIfUrl}
                        />
                        {this.ifUrl()}
                        <TextField
                            style={styles.input}
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
                    <Link href={url}> {polyglot.t('here')} </Link>
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
                        formatData={formatData /* injection dans le props ici*/}
                        field={field}
                    />
                </div>
            );
        }
    }

    SparqlRequest.WrappedComponent = FormatView;

    const mapStateToProps = (state, { field }) => ({
        formatData: fromFormat.getFormatData(state, field.name),
        isLoaded: field && fromFormat.isFormatDataLoaded(state, field.name),
        error: fromFormat.getFormatError(state, field.name),
    });

    const mapDispatchToProps = {
        loadFormatData,
    };

    return compose(
        connect(
            mapStateToProps,
            mapDispatchToProps,
        ),
        translate,
    )(SparqlRequest);
};
