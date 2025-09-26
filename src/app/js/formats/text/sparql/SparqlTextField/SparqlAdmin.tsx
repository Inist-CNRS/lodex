import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from '../../../../i18n/I18NContext';
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
                // @ts-expect-error TS2339
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

    // @ts-expect-error TS7006
    handleEndpoint = (e) => {
        const endpoint = e.target.value;
        // @ts-expect-error TS2339
        const { sparql, ...args } = this.props.args;
        const newArgs = { ...args, sparql: { ...sparql, endpoint } };
        // @ts-expect-error TS2339
        this.props.onChange(newArgs);
    };

    // @ts-expect-error TS7006
    handleRequest = (e) => {
        const request = e.target.value;
        // @ts-expect-error TS2339
        const { sparql, ...args } = this.props.args;
        const newArgs = { ...args, sparql: { ...sparql, request } };
        // @ts-expect-error TS2339
        this.props.onChange(newArgs);
    };

    // @ts-expect-error TS7006
    handleMaxValue = (e) => {
        let maxValue = e.target.value;
        if (maxValue < 1) {
            maxValue = 1;
        }
        // @ts-expect-error TS2339
        const { sparql, ...state } = this.props.args;
        const newState = { ...state, sparql: { ...sparql, maxValue } };
        // @ts-expect-error TS2339
        this.props.onChange(newState);
    };
    // @ts-expect-error TS7006
    handleHiddenInfo = (event) => {
        let hiddenInfo = event.target.checked;
        // @ts-expect-error TS2339
        const { sparql, ...state } = this.props.args;
        const newState = { ...state, sparql: { ...sparql, hiddenInfo } };
        // @ts-expect-error TS2339
        this.props.onChange(newState);
    };

    // @ts-expect-error TS7006
    handleSeparator = (e) => {
        const separator = e.target.value;
        // @ts-expect-error TS2339
        const { sparql, ...args } = this.props.args;
        const newArgs = { ...args, sparql: { ...sparql, separator } };
        // @ts-expect-error TS2339
        this.props.onChange(newArgs);
    };

    handleAddSubformat = () => {
        // @ts-expect-error TS2339
        const { sparql, ...state } = this.props.args;
        let subformat = sparql.subformat;
        subformat.push({ attribute: '?example', sub: '', option: {} });
        const newState = { ...state, sparql: { ...sparql, subformat } };
        // @ts-expect-error TS2339
        this.props.onChange(newState);
    };

    // @ts-expect-error TS7006
    handleRemoveSubformat = (key) => {
        // @ts-expect-error TS2339
        const { sparql, ...state } = this.props.args;
        let subformat = sparql.subformat;
        subformat.splice(key.key, 1);
        const newState = { ...state, sparql: { ...sparql, subformat } };
        // @ts-expect-error TS2339
        this.props.onChange(newState);
    };

    // @ts-expect-error TS7006
    handleAttribute = (attribute, key) => {
        // @ts-expect-error TS2339
        const { sparql, ...state } = this.props.args;
        let subformat = sparql.subformat;
        subformat[key].attribute = attribute;
        const newState = { ...state, sparql: { ...sparql, subformat } };
        // @ts-expect-error TS2339
        this.props.onChange(newState);
    };

    // @ts-expect-error TS7006
    handleSubformat = (sub, key) => {
        // @ts-expect-error TS2339
        const { sparql, ...state } = this.props.args;
        let subformat = sparql.subformat;
        subformat[key].sub = sub;
        const newState = { ...state, sparql: { ...sparql, subformat } };
        // @ts-expect-error TS2339
        this.props.onChange(newState);
    };

    // @ts-expect-error TS7006
    handleSubformatOption = (option, key) => {
        // @ts-expect-error TS2339
        const { sparql, ...state } = this.props.args;
        let subformat = sparql.subformat;
        subformat[key].option = option;
        const newState = { ...state, sparql: { ...sparql, subformat } };
        // @ts-expect-error TS2339
        this.props.onChange(newState);
    };

    validator = () => {
        window.open('https://edmo.seadatanet.org/sparql/query-validator.html');
    };

    // @ts-expect-error TS7006
    loadSubformat = (result, key) => {
        // @ts-expect-error TS2339
        const { p: polyglot } = this.props;
        const SubAdminComponent = getAdminComponent(result.sub);

        return (
            <Box display="flex" flexDirection="column" flexGrow={1} gap={2}>
                <TextField
                    fullWidth
                    label={polyglot.t('sparql_attribute')}
                    type="string"
                    onChange={(e) => this.handleAttribute(e.target.value, key)}
                    value={result.attribute}
                />
                <SelectFormat
                    // @ts-expect-error TS7006
                    onChange={(e) => this.handleSubformat(e, key)}
                    formats={FORMATS}
                    value={result.sub}
                />
                {result.sub && (
                    <SubAdminComponent
                        // @ts-expect-error TS7006
                        onChange={(e) => this.handleSubformatOption(e, key)}
                        args={result.option}
                    />
                )}
            </Box>
        );
    };

    render() {
        const {
            // @ts-expect-error TS2339
            p: polyglot,
            // @ts-expect-error TS2339
            args: { sparql },
        } = this.props;
        const { endpoint, request, maxValue, hiddenInfo, separator } =
            sparql || defaultArgs.sparql;

        return (
            <FormatGroupedFieldSet>
                {/*
                 // @ts-expect-error TS2322 */}
                <FormatDataParamsFieldSet>
                    {/*
                     // @ts-expect-error TS2322 */}
                    <TextField
                        label={polyglot.t('sparql_endpoint')}
                        value={endpoint}
                        onChange={this.handleEndpoint}
                        type="text"
                        name="valueEnpoint"
                        list="listEnpoint"
                        // @ts-expect-error TS2322
                        required="true"
                        fullWidth
                    />
                    {/*
                     // @ts-expect-error TS2322 */}
                    <datalist id="listEnpoint">
                        {endpoints.map((source) => (
                            <option key={source} value={source} />
                        ))}
                    </datalist>
                    {/*
                     // @ts-expect-error TS2322 */}
                    <Box width="100%">
                        <TextField
                            label={polyglot.t('sparql_request')}
                            multiline
                            onChange={this.handleRequest}
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
                    {/*
                     // @ts-expect-error TS2322 */}
                    <TextField
                        label={polyglot.t('max_value')}
                        type="number"
                        onChange={this.handleMaxValue}
                        value={maxValue}
                        fullWidth
                    />
                    {/*
                     // @ts-expect-error TS2322 */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={this.handleHiddenInfo}
                                checked={hiddenInfo}
                            />
                        }
                        label={polyglot.t('hidden_info')}
                    />
                    {/*
                     // @ts-expect-error TS2322 */}
                    <TextField
                        label={polyglot.t('sparql_list_separator')}
                        type="string"
                        onChange={this.handleSeparator}
                        value={separator}
                        fullWidth
                    />
                </FormatDataParamsFieldSet>
                {/*
                 // @ts-expect-error TS2322 */}
                <FormatDefaultParamsFieldSet defaultExpanded>
                    <Box
                        display="flex"
                        alignItems="center"
                        onClick={() => this.handleAddSubformat()}
                        sx={{
                            cursor: 'pointer',
                        }}
                    >
                        <ContentAdd style={{ verticalAlign: 'sub' }} />
                        {polyglot.t('sparql_add_subformat')}
                    </Box>
                    {/*
                     // @ts-expect-error TS7006 */}
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
                                        this.handleRemoveSubformat({ key })
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
