import flattenPatch from './flatten-patch';
import objects2columns from './objects2columns';
import convertJsonLdToNQuads from './convertJsonLdToNQuads';
import convertToAtom from './convertToAtom';
import convertToExtendedJsonLd from './convertToExtendedJsonLd';
import convertToJson from './convertToJson';
import convertToSitemap from './convertToSitemap';
import extractIstexQuery from './extractIstexQuery';
import filterContributions from './filterContributions';
import filterVersions from './filterVersions';
import linkDataset from './linkDataset';
import useFieldNames from './useFieldNames';
import JSONLDCompacter from './JSONLDCompacter';
import JSONLDString from './JSONLDString';
import JSONLDObject from './JSONLDObject';
import disabled from './disabled';
import runQuery from './runQuery';
import reduceQuery from './reduceQuery';
import formatOutput from './formatOutput';
import getLastCharacteristic from './getLastCharacteristic';
import keyMapping from './keyMapping';
import parseNQuads from './parseNQuads';
import writeTurtle from './writeTurtle';
import getFields from './getFields';
import getCharacteristics from './getCharacteristics';
import injectDatasetFields from './injectDatasetFields';
import injectSyndicationFrom from './injectSyndicationFrom';
import injectCountFrom from './injectCountFrom';
import labelizeFieldID from './labelizeFieldID';
import buildContext from './buildContext';
import aggregateQuery from './aggregateQuery';
import LodexJoinQuery from './joinQuery';

const funcs = {
    flattenPatch,
    objects2columns,
    convertJsonLdToNQuads,
    convertToAtom,
    convertToExtendedJsonLd,
    convertToJson,
    convertToSitemap,
    extractIstexQuery,
    filterContributions,
    filterVersions,
    getLastCharacteristic,
    keyMapping,
    linkDataset,
    useFieldNames,
    JSONLDCompacter,
    JSONLDString,
    JSONLDObject,
    getFields,
    getCharacteristics,
    injectDatasetFields,
    injectSyndicationFrom,
    injectCountFrom,
    labelizeFieldID,
    runQuery,
    reduceQuery,
    formatOutput,
    parseNQuads,
    buildContext,
    aggregateQuery,
    writeTurtle,
    LodexJoinQuery,
    // aliases
    fixFlatten: flattenPatch.flattenPatch,
    LodexContext: disabled.disabled,
    LodexConfig: disabled.disabled,
    LodexParseQuery: disabled.disabled,
    LodexSetField: disabled.disabled,
    LodexGetFields: getFields.getFields,
    LodexGetCharacteristics: getCharacteristics.getCharacteristics,
    LodexDocuments: runQuery.runQuery,
    LodexRunQuery: runQuery.runQuery,
    LodexReduceQuery: reduceQuery.reduceQuery,
    LodexOutput: formatOutput.formatOutput,
    LodexBuildContext: buildContext.buildContext,
    LodexInjectSyndicationFrom: injectSyndicationFrom.injectSyndicationFrom,
    LodexInjectCountFrom: injectCountFrom.injectCountFrom,
    LodexAggregateQuery: aggregateQuery.aggregateQuery,
};

export default funcs;

module.exports = funcs;
