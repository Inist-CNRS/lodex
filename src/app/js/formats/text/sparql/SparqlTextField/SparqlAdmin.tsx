import { translate } from '@lodex/frontend-common/i18n/I18NContext';
import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';
import ContentAdd from '@mui/icons-material/Add';
import ContentClear from '@mui/icons-material/Clear';

import config from '../../../../../../../config.json';
import SelectFormat from '../../../SelectFormat';
import { FORMATS, getAdminComponent } from '../../../getFormat';
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

interface SparqlTextFieldAdminProps {
    args?: {
        sparql: {
            endpoint?: string;
            maxValue?: number;
            request?: string;
            hiddenInfo?: unknown;
            separator?: string;
            subformat: object[];
        };
    };
    onChange(...args: unknown[]): unknown;
    p: any;
}

const SparqlTextFieldAdmin = ({
    args = defaultArgs,
    onChange,
    p: polyglot,
}: SparqlTextFieldAdminProps) => {
    // @ts-expect-error TS7006
    const handleEndpoint = (e) => {
        const endpoint = e.target.value;
        const { sparql, ...rest } = args;
        const newArgs = { ...rest, sparql: { ...sparql, endpoint } };
        onChange(newArgs);
    };

    // @ts-expect-error TS7006
    const handleRequest = (e) => {
        const request = e.target.value;
        const { sparql, ...rest } = args;
        const newArgs = { ...rest, sparql: { ...sparql, request } };
        onChange(newArgs);
    };

    // @ts-expect-error TS7006
    const handleMaxValue = (e) => {
        let maxValue = e.target.value;
        if (maxValue < 1) {
            maxValue = 1;
        }
        const { sparql, ...rest } = args;
        const newState = { ...rest, sparql: { ...sparql, maxValue } };
        onChange(newState);
    };

    // @ts-expect-error TS7006
    const handleHiddenInfo = (event) => {
        const hiddenInfo = event.target.checked;
        const { sparql, ...rest } = args;
        const newState = { ...rest, sparql: { ...sparql, hiddenInfo } };
        onChange(newState);
    };

    // @ts-expect-error TS7006
    const handleSeparator = (e) => {
        const separator = e.target.value;
        const { sparql, ...rest } = args;
        const newArgs = { ...rest, sparql: { ...sparql, separator } };
        onChange(newArgs);
    };

    const handleAddSubformat = () => {
        const { sparql, ...rest } = args;
        const subformat = sparql.subformat;
        subformat.push({ attribute: '?example', sub: '', option: {} });
        const newState = { ...rest, sparql: { ...sparql, subformat } };
        onChange(newState);
    };

    // @ts-expect-error TS7006
    const handleRemoveSubformat = (key) => {
        const { sparql, ...rest } = args;
        const subformat = sparql.subformat;
        subformat.splice(key.key, 1);
        const newState = { ...rest, sparql: { ...sparql, subformat } };
        onChange(newState);
    };

    // @ts-expect-error TS7006
    const handleAttribute = (attribute, key) => {
        const { sparql, ...rest } = args;
        const subformat = sparql.subformat;
        // @ts-expect-error TS7053
        subformat[key].attribute = attribute;
        const newState = { ...rest, sparql: { ...sparql, subformat } };
        onChange(newState);
    };

    // @ts-expect-error TS7006
    const handleSubformat = (sub, key) => {
        const { sparql, ...rest } = args;
        const subformat = sparql.subformat;
        // @ts-expect-error TS7053
        subformat[key].sub = sub;
        const newState = { ...rest, sparql: { ...sparql, subformat } };
        onChange(newState);
    };

    // @ts-expect-error TS7006
    const handleSubformatOption = (option, key) => {
        const { sparql, ...rest } = args;
        const subformat = sparql.subformat;
        // @ts-expect-error TS7053
        subformat[key].option = option;
        const newState = { ...rest, sparql: { ...sparql, subformat } };
        onChange(newState);
    };

    const validator = () => {
        window.open('https://edmo.seadatanet.org/sparql/query-validator.html');
    };

    // @ts-expect-error TS7006
    const loadSubformat = (result, key) => {
        const SubAdminComponent = getAdminComponent(result.sub);

        return (
            <Box display="flex" flexDirection="column" flexGrow={1} gap={2}>
                <TextField
                    fullWidth
                    label={polyglot.t('sparql_attribute')}
                    type="string"
                    onChange={(e) => handleAttribute(e.target.value, key)}
                    value={result.attribute}
                />
                <SelectFormat
                    onChange={(e) => handleSubformat(e, key)}
                    formats={FORMATS}
                    value={result.sub}
                />
                {result.sub && (
                    // @ts-expect-error TS2739 - Too complex union type from getAdminComponent
                    <SubAdminComponent
                        onChange={(e) => handleSubformatOption(e, key)}
                        args={result.option}
                    />
                )}
            </Box>
        );
    };

    const { sparql } = args || defaultArgs;
    const { endpoint, request, maxValue, hiddenInfo, separator } =
        sparql || defaultArgs.sparql;

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet>
                <TextField
                    label={polyglot.t('sparql_endpoint')}
                    value={endpoint}
                    onChange={handleEndpoint}
                    type="text"
                    name="valueEnpoint"
                    list="listEnpoint"
                    // @ts-expect-error TS2322
                    required="true"
                    fullWidth
                />
                <datalist id="listEnpoint">
                    {endpoints.map((source) => (
                        <option key={source} value={source} />
                    ))}
                </datalist>
                <Box width="100%">
                    <TextField
                        label={polyglot.t('sparql_request')}
                        multiline
                        onChange={handleRequest}
                        value={request}
                        fullWidth
                    />
                    <a
                        onClick={() => {
                            validator();
                        }}
                        className="link_validator"
                    >
                        {polyglot.t('sparql_validator')}
                    </a>
                </Box>
                <TextField
                    label={polyglot.t('max_value')}
                    type="number"
                    onChange={handleMaxValue}
                    value={maxValue}
                    fullWidth
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={handleHiddenInfo}
                            checked={Boolean(hiddenInfo)}
                        />
                    }
                    label={polyglot.t('hidden_info')}
                />
                <TextField
                    label={polyglot.t('sparql_list_separator')}
                    type="string"
                    onChange={handleSeparator}
                    value={separator}
                    fullWidth
                />
            </FormatDataParamsFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <Box
                    display="flex"
                    alignItems="center"
                    onClick={() => handleAddSubformat()}
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
                            id={String(key)}
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
                                onClick={() => handleRemoveSubformat({ key })}
                                sx={{
                                    cursor: 'pointer',
                                    color: 'red',
                                    margin: 1,
                                }}
                            />
                            {loadSubformat(result, key)}
                        </Box>
                    );
                })}
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default translate(SparqlTextFieldAdmin);
