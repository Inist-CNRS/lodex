import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import SparqlRequest from './SparqlRequest';
import { isURL } from '../../../../../common/uris.js';
import { field as fieldPropTypes } from '../../../propTypes';

import URL from 'url';
import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import TextField from 'material-ui/TextField';

const styles = {
    icon: {
        verticalAlign: 'bottom',
        width: '5%',
    },
    container: {
        display: 'block',
        width: '100%',
        color: 'lightGrey',
    },
    input: {
        fontSize: '0.7em',
        width: '95%',
        borderImage: 'none',
    },
};

export class sparqlText extends Component {
    render() {
        const { className, rawData, sparql, resource, field } = this.props;

        if (rawData != undefined) {
            const requestText =
                sparql.hostname + '?query=' + resource[field.name]; //@TODO à voir pour le format
            return (
                <div className={className}>
                    <div style={styles.container}>
                        <IconButton style={styles.icon}>
                            <ActionSearch color="lightGrey" />
                        </IconButton>
                        <TextField
                            style={styles.input}
                            name="sparqlRequest"
                            value={requestText}
                        />
                    </div>
                    <div>{JSON.stringify(rawData)}</div>
                </div>
            );
        } else {
            return <span> </span>;
        }
    }
}

sparqlText.propTypes = {
    className: PropTypes.string,
    rawData: PropTypes.object,
    sparql: PropTypes.object,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
};

sparqlText.defaultProps = {
    className: null,
};

export default compose(
    translate,
    SparqlRequest(({ field, resource, sparql }) => {
        const value = resource[field.name];
        if (!value) {
            return null;
        }
        let constructURL = sparql.hostname;
        !constructURL.startsWith('http://') &&
        !constructURL.startsWith('https://')
            ? (constructURL = 'https://' + constructURL)
            : null;

        !constructURL.endsWith('?query=')
            ? (constructURL = constructURL + '?query=')
            : null;

        constructURL = constructURL + value.trim();
        constructURL = constructURL.replace(/LIMIT\s\d*/, ''); //remove LIMIT with her var
        const requestPagination = constructURL + ' LIMIT ' + sparql.maxValue;
        if (isURL(requestPagination)) {
            const source = URL.parse(requestPagination);
            const target = {
                protocol: source.protocol,
                hostname: source.hostname,
                slashes: source.slashes,
                pathname: source.pathname,
                search: source.search,
            };
            return URL.format(target);
        }
        return null;
    }),
)(sparqlText);
