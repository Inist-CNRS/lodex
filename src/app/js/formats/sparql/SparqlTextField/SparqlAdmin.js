import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import TextField from 'material-ui/TextField';

import { polyglot as polyglotPropTypes } from '../../../propTypes';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
        justifyContent: 'space-between',
    },
    input: {
        width: '100%',
    },
    previewDefaultColor: color => ({
        display: 'inline-block',
        backgroundColor: color,
        height: '1em',
        width: '1em',
        marginLeft: 5,
        border: 'solid 1px black',
    }),
};

export const defaultArgs = {
    sparql: {
        endpoint: '//data.istex.fr/sparql/',
        request: `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?LibelleNomBnf ?LienCatalogueBnf ?uri
WHERE
{
  ?uri <http://www.w3.org/2004/02/skos/core#exactMatch> <??>.
  ?uri <http://www.w3.org/2004/02/skos/core#prefLabel> ?LibelleNomBnf.
  ?uri rdfs:seeAlso ?LienCatalogueBnf.
}`,
    },
};

class SparqlTextFieldAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            sparql: PropTypes.shape({
                endpoint: PropTypes.string,
                request: PropTypes.string,
            }),
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setEndpoint = (_, endpoint) => {
        const { sparql, ...args } = this.props.args;
        const newArgs = { ...args, sparql: { ...sparql, endpoint } };
        this.props.onChange(newArgs);
    };

    setRequest = (_, request) => {
        const { sparql, ...args } = this.props.args;
        const newArgs = { ...args, sparql: { ...sparql, request } };
        this.props.onChange(newArgs);
    };

    render() {
        const { p: polyglot, args: { sparql } } = this.props;
        const { endpoint, request } = sparql || defaultArgs.sparql;

        return (
            <div style={styles.container}>
                <TextField
                    floatingLabelText={polyglot.t('sparql_endpoint')}
                    onChange={this.setEndpoint}
                    style={styles.input}
                    value={endpoint}
                />
                <TextField
                    floatingLabelText={polyglot.t('sparql_request')}
                    multiLine={true}
                    onChange={this.setRequest}
                    style={styles.input}
                    value={request}
                />
            </div>
        );
    }
}

export default translate(SparqlTextFieldAdmin);
