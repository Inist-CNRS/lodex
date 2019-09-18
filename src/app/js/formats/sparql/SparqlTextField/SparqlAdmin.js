import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { TextField } from '@material-ui/core';
import config from '../../../../../../config.json';
import { Add as ContentAdd, Clear as ContentClear } from '@material-ui/icons';
import SelectFormat from '../../SelectFormat';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { FORMATS, getAdminComponent } from '../../';

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
    subformatPointer: {
        cursor: 'pointer',
        width: '7%',
        color: 'red',
        verticalAlign: 'top',
        marginTop: 14,
    },
    subformatInput: {
        width: '40%',
        marginLeft: '1%',
        marginRight: '1%',
        marginTop: '0',
    },
    link: {
        fontSize: 'small',
    },
    inline: {
        width: '90%',
        display: 'inline-block',
    },
    applyFormat: {
        width: '40%',
        display: 'inline',
        verticalAlign: 'top',
        marginTop: 14,
    },
    color1: {
        backgroundColor: '#e9e9e9',
        width: '100%',
        borderStyle: 'solid',
        borderColor: 'darkGrey',
        borderWidth: '1px',
        marginBottom: '2px',
    },
    color2: {
        backgroundColor: '#d0d0d0',
        width: '100%',
        borderStyle: 'solid',
        borderColor: 'darkGrey',
        borderWidth: '1px',
        marginBottom: '2px',
    },
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
        subformat: [],
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
                subformat: PropTypes.arrayOf(PropTypes.object),
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

    addSubformat = () => {
        const { sparql, ...state } = this.props.args;
        let subformat = sparql.subformat;
        subformat.push({ attribute: '?example', sub: '', option: {} });
        const newState = { ...state, sparql: { ...sparql, subformat } };
        this.props.onChange(newState);
    };

    removeSubformat = key => {
        const { sparql, ...state } = this.props.args;
        let subformat = sparql.subformat;
        subformat.splice(key.key, 1);
        const newState = { ...state, sparql: { ...sparql, subformat } };
        this.props.onChange(newState);
    };

    setAttribute = (attribute, key) => {
        const { sparql, ...state } = this.props.args;
        let subformat = sparql.subformat;
        subformat[key].attribute = attribute;
        const newState = { ...state, sparql: { ...sparql, subformat } };
        this.props.onChange(newState);
    };

    setSubformat = (sub, key) => {
        const { sparql, ...state } = this.props.args;
        let subformat = sparql.subformat;
        subformat[key].sub = sub;
        const newState = { ...state, sparql: { ...sparql, subformat } };
        this.props.onChange(newState);
    };

    setSubformatOption = (option, key) => {
        const { sparql, ...state } = this.props.args;
        let subformat = sparql.subformat;
        subformat[key].option = option;
        const newState = { ...state, sparql: { ...sparql, subformat } };
        this.props.onChange(newState);
    };

    validator = () => {
        window.open('http://sparql.org/query-validator.html');
    };

    loadSubformat = (result, key) => {
        const { p: polyglot } = this.props;
        const SubAdminComponent = getAdminComponent(result.sub);

        return (
            <div style={styles.inline}>
                <TextField
                    floatingLabelText={polyglot.t('sparql_attribute')}
                    type="string"
                    onChange={e => this.setAttribute(e.target.value, key)}
                    style={styles.subformatInput}
                    value={result.attribute}
                />
                <div style={styles.applyFormat}>
                    <SelectFormat
                        onChange={e => this.setSubformat(e, key)}
                        formats={FORMATS}
                        value={result.sub}
                    />
                </div>
                <SubAdminComponent
                    onChange={e => this.setSubformatOption(e, key)}
                    args={result.option}
                />
            </div>
        );
    };

    render() {
        const {
            p: polyglot,
            args: { sparql },
        } = this.props;
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
                <TextField
                    floatingLabelText={polyglot.t('sparql_request')}
                    multiLine={true}
                    onChange={this.setRequest}
                    style={styles.input}
                    value={request}
                />
                <a
                    onClick={() => {
                        this.validator();
                    }}
                    className="link_validator"
                    style={(styles.pointer, styles.link)}
                >
                    {polyglot.t('sparql_validator')}
                </a>
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
                <div style={{ width: '100%' }}>
                    <div
                        onClick={() => {
                            this.addSubformat();
                        }}
                        style={styles.pointer}
                    >
                        <ContentAdd style={{ verticalAlign: 'sub' }} />
                        {polyglot.t('sparql_add_subformat')}
                    </div>
                    {sparql.subformat.map((result, key) => {
                        return (
                            <div
                                id={key}
                                key={key}
                                style={
                                    key % 2 == 1 ? styles.color1 : styles.color2
                                }
                            >
                                <ContentClear
                                    onClick={() => {
                                        this.removeSubformat({ key });
                                    }}
                                    style={styles.subformatPointer}
                                />
                                {this.loadSubformat(result, key)}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default translate(SparqlTextFieldAdmin);
