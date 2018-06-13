import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import TextField from 'material-ui/TextField';
import config from '../../../../../../config.json';

import { polyglot as polyglotPropTypes } from '../../../propTypes';

const endpoints = config.sparqlEndpoints;

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
        justifyContent: 'space-between',
    },
    pointer: {
        cursor: 'pointer',
        marginTop: 12,
        marginBottom: '5px',
    },
    input: {
        width: '100%',
    },
    checkbox: {
        marginTop: 12,
        marginRight: 5,
        verticalAlign: 'sub',
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
        endpoint: 'https://data.istex.fr/sparql/',
        maxValue: 1,
        request: `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT ?LibelleNomBnf ?LienCatalogueBnf ?uri
WHERE
{
  ?uri skos:exactMatch <??>.
  ?uri skos:prefLabel ?LibelleNomBnf.
  ?uri rdfs:seeAlso ?LienCatalogueBnf.
}`,
        hiddenInfo: false,
        separator: ';;',
    },
};

class SparqlTextFieldAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            sparql: PropTypes.shape({
                endpoint: PropTypes.string,
                maxValue: PropTypes.number,
                request: PropTypes.string,
                hiddenInfo: PropTypes.boolean,
                separator: PropTypes.string,
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

    setMaxValue = (_, maxValue) => {
        if (maxValue < 1) {
            maxValue = 1;
        }
        const { sparql, ...state } = this.props.args;
        const newState = { ...state, sparql: { ...sparql, maxValue } };
        this.props.onChange(newState);
    };
    setHiddenInfo = event => {
        let hiddenInfo = event.target.checked;
        const { sparql, ...state } = this.props.args;
        const newState = { ...state, sparql: { ...sparql, hiddenInfo } };
        this.props.onChange(newState);
    };

    setSeparator = (_, separator) => {
        const { sparql, ...args } = this.props.args;
        const newArgs = { ...args, sparql: { ...sparql, separator } };
        this.props.onChange(newArgs);
    };

    validator = () => {
        window.open('http://sparql.org/query-validator.html');
    };

    render() {
        const { p: polyglot, args: { sparql } } = this.props;
        const { endpoint, request, maxValue, hiddenInfo, separator } =
            sparql || defaultArgs.sparql;

        return (
            <div style={styles.container}>
                <TextField
                    floatingLabelText={polyglot.t('sparql_endpoint')}
                    style={styles.input}
                    value={endpoint}
                    onChange={this.setEndpoint}
                    type="text"
                    name="valueEnpoint"
                    list="listEnpoint"
                    required="true"
                />
                <datalist id="listEnpoint">
                    {endpoints.map(source => (
                        <option key={source} value={source} />
                    ))}
                </datalist>

                <a
                    onClick={() => {
                        this.validator();
                    }}
                    className="link_validator"
                    style={styles.pointer}
                >
                    {polyglot.t('sparql_validator')}
                </a>
                <TextField
                    floatingLabelText={polyglot.t('sparql_request')}
                    multiLine={true}
                    onChange={this.setRequest}
                    style={styles.input}
                    value={request}
                />
                <TextField
                    floatingLabelText={polyglot.t('max_value')}
                    type="number"
                    onChange={this.setMaxValue}
                    style={styles.input}
                    value={maxValue}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={hiddenInfo}
                        onChange={this.setHiddenInfo}
                        style={styles.checkbox}
                    />
                    {polyglot.t('hidden_info')}
                </label>
                <TextField
                    floatingLabelText={polyglot.t('sparql_list_separator')}
                    type="string"
                    onChange={this.setSeparator}
                    style={styles.input}
                    value={separator}
                />
            </div>
        );
    }
}

export default translate(SparqlTextFieldAdmin);
