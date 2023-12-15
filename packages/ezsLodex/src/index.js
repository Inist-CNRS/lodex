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
import filterPrecomputed from './filterPrecomputed';
import runQuery from './runQuery';
import runQueryPrecomputed from './runQueryPrecomputed';
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
import saveDocuments from './saveDocuments.js';

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
    filterPrecomputed,
    runQuery,
    runQueryPrecomputed,
    reduceQuery,
    formatOutput,
    parseNQuads,
    buildContext,
    aggregateQuery,
    writeTurtle,
    LodexJoinQuery,
    saveDocuments,
    // aliases
    fixFlatten: flattenPatch.flattenPatch,
    LodexContext: disabled.disabled,
    LodexConfig: disabled.disabled,
    LodexParseQuery: disabled.disabled,
    LodexSetField: disabled.disabled,
    LodexGetFields: getFields.getFields,
    LodexGetCharacteristics: getCharacteristics.getCharacteristics,
    LodexDocuments: runQuery.runQuery,
    LodexFilterPrecomputed: filterPrecomputed.filterPrecomputed,
    LodexRunQuery: runQuery.runQuery,
    LodexRunQueryPrecomputed: runQueryPrecomputed.runQueryPrecomputed,
    LodexReduceQuery: reduceQuery.reduceQuery,
    LodexOutput: formatOutput.formatOutput,
    LodexBuildContext: buildContext.buildContext,
    LodexInjectSyndicationFrom: injectSyndicationFrom.injectSyndicationFrom,
    LodexInjectCountFrom: injectCountFrom.injectCountFrom,
    LodexAggregateQuery: aggregateQuery.aggregateQuery,
    LodexSaveDocuments: saveDocuments.saveDocuments,
};

export default funcs;

module.exports = funcs;
