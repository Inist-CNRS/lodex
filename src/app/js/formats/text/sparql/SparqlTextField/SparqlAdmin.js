import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';
import ContentAdd from '@mui/icons-material/Add';
import ContentClear from '@mui/icons-material/Clear';

import config from '../../../../../../../config.json';
import SelectFormat from '../../../SelectFormat';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import { FORMATS, getAdminComponent } from '../../../index';
import {
    FormatDataParamsFieldSet,
    FormatDefaultParamsFieldSet,
} from '../../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../../utils/components/field-set/FormatGroupedFieldSet';

const endpoints = config.sparqlEndpoints;

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

    setEndpoint = e => {
        const endpoint = e.target.value;
        const { sparql, ...args } = this.props.args;
        const newArgs = { ...args, sparql: { ...sparql, endpoint } };
        this.props.onChange(newArgs);
    };

    setRequest = e => {
        const request = e.target.value;
        const { sparql, ...args } = this.props.args;
        const newArgs = { ...args, sparql: { ...sparql, request } };
        this.props.onChange(newArgs);
    };

    setMaxValue = e => {
        let maxValue = e.target.value;
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

    setSeparator = e => {
        const separator = e.target.value;
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
        window.open('https://edmo.seadatanet.org/sparql/query-validator.html');
    };

    loadSubformat = (result, key) => {
        const { p: polyglot } = this.props;
        const SubAdminComponent = getAdminComponent(result.sub);

        return (
            <Box display="flex" flexDirection="column" flexGrow={1} gap={2}>
                <TextField
                    fullWidth
                    label={polyglot.t('sparql_attribute')}
                    type="string"
                    onChange={e => this.setAttribute(e.target.value, key)}
                    value={result.attribute}
                />
                <SelectFormat
                    onChange={e => this.setSubformat(e, key)}
                    formats={FORMATS}
                    value={result.sub}
                />
                {result.sub && (
                    <SubAdminComponent
                        onChange={e => this.setSubformatOption(e, key)}
                        args={result.option}
                    />
                )}
            </Box>
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
            <FormatGroupedFieldSet>
                <FormatDataParamsFieldSet>
                    <TextField
                        label={polyglot.t('sparql_endpoint')}
                        value={endpoint}
                        onChange={this.setEndpoint}
                        type="text"
                        name="valueEnpoint"
                        list="listEnpoint"
                        required="true"
                        fullWidth
                    />
                    <datalist id="listEnpoint">
                        {endpoints.map(source => (
                            <option key={source} value={source} />
                        ))}
                    </datalist>
                    <Box width="100%">
                        <TextField
                            label={polyglot.t('sparql_request')}
                            multiline
                            onChange={this.setRequest}
                            value={request}
                            fullWidth
                        />
                        <a
                            onClick={() => {
                                this.validator();
                            }}
                            className="link_validator"
                        >
                            {polyglot.t('sparql_validator')}
                        </a>
                    </Box>
                    <TextField
                        label={polyglot.t('max_value')}
                        type="number"
                        onChange={this.setMaxValue}
                        value={maxValue}
                        fullWidth
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={this.setHiddenInfo}
                                checked={hiddenInfo}
                            />
                        }
                        label={polyglot.t('hidden_info')}
                    />
                    <TextField
                        label={polyglot.t('sparql_list_separator')}
                        type="string"
                        onChange={this.setSeparator}
                        value={separator}
                        fullWidth
                    />
                </FormatDataParamsFieldSet>
                <FormatDefaultParamsFieldSet>
                    <Box
                        display="flex"
                        alignItems="center"
                        onClick={() => this.addSubformat()}
                        sx={{
                            cursor: 'pointer',
                        }}
                    >
                        <ContentAdd style={{ verticalAlign: 'sub' }} />
                        {polyglot.t('sparql_add_subformat')}
                    </Box>
                    {sparql.subformat.map((result, key) => {
                        return (
                            <Box
                                id={key}
                                key={key}
                                sx={{
                                    display: 'flex',
                                    width: '100%',
                                    borderStyle: 'solid',
                                    borderColor: 'darkGrey',
                                    borderWidth: '1px',
                                    borderRadius: '5px',
                                    marginBottom: '2px',
                                    padding: 2,
                                    backgroundColor:
                                        key % 2 === 1
                                            ? 'rgba(233,233,233,0.25)'
                                            : 'rgba(208,208,208,0.25)',
                                }}
                            >
                                <ContentClear
                                    onClick={() =>
                                        this.removeSubformat({ key })
                                    }
                                    sx={{
                                        cursor: 'pointer',
                                        color: 'red',
                                        margin: 1,
                                    }}
                                />
                                {this.loadSubformat(result, key)}
                            </Box>
                        );
                    })}
                </FormatDefaultParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(SparqlTextFieldAdmin);
