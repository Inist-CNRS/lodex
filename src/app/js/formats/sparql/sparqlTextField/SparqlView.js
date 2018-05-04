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

const SparqlToto = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?LibelleNomBnf ?LienCatalogueBnf ?uri
WHERE
{
  ?uri <http://www.w3.org/2004/02/skos/core#exactMatch> <http://sws.geonames.org/3182997/>.
  ?uri <http://www.w3.org/2004/02/skos/core#prefLabel> ?LibelleNomBnf.
  ?uri rdfs:seeAlso ?LienCatalogueBnf.
}`;

export class SparqlText extends Component {
    render() {
        const { className, rawData, resource, field } = this.props;

        if (rawData != undefined) {
            const requestText = resource[field.name];
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
                    {JSON.stringify(rawData)}
                </div>
            );
        } else {
            return <span> </span>;
        }
    }
}

SparqlText.propTypes = {
    className: PropTypes.string,
    rawData: PropTypes.object,
    sparql: PropTypes.object,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
};

SparqlText.defaultProps = {
    className: null,
};

export default compose(
    translate,
    SparqlRequest(({ field, resource, sparql }) => {
        const value = resource[field.name];
        if (!value) {
            return null;
        }
        let constructURL = sparql.hostname.replace(/[\s\n\r\u200B]+/, '');
        !constructURL.startsWith('http://') &&
        !constructURL.startsWith('https://')
            ? (constructURL = 'https://' + constructURL)
            : null;

        !constructURL.endsWith('?query=') ? (constructURL += '?query=') : null;

        constructURL += SparqlToto.replace(/[\n\r\u200B]+/g, ' ').replace(/[#]/g,'%23'); //eslint-disable-line
        constructURL = constructURL.replace(/LIMIT\s\d*/, ''); //remove LIMIT with her var
        const requestPagination = constructURL; //+ ' LIMIT 1';
        if (isURL(requestPagination)) {
            const source = URL.parse(requestPagination);

            return URL.format(source);
        }
        return null;
    }),
)(SparqlText);
