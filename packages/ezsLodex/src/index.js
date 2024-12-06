import flattenPatch from './flatten-patch';
import objects2columns from './objects2columns';
import convertToAtom from './convertToAtom';
import convertToJson from './convertToJson';
import convertToSitemap from './convertToSitemap';
import extractIstexQuery from './extractIstexQuery';
import filterContributions from './filterContributions';
import filterVersions from './filterVersions';
import linkDataset from './linkDataset';
import useFieldNames from './useFieldNames';
import disabled from './disabled';
import runQuery from './runQuery';
import runQueryPrecomputed from './runQueryPrecomputed';
import reduceQuery from './reduceQuery';
import formatOutput from './formatOutput';
import getLastCharacteristic from './getLastCharacteristic';
import keyMapping from './keyMapping';
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
import precomputedSelect from './precomputedSelect.js';

const funcs = {
    flattenPatch,
    objects2columns,
    convertToAtom,
    convertToJson,
    convertToSitemap,
    extractIstexQuery,
    filterContributions,
    filterVersions,
    getLastCharacteristic,
    keyMapping,
    linkDataset,
    useFieldNames,
    getFields,
    getCharacteristics,
    injectDatasetFields,
    injectSyndicationFrom,
    injectCountFrom,
    labelizeFieldID,
    runQuery,
    runQueryPrecomputed,
    reduceQuery,
    formatOutput,
    buildContext,
    aggregateQuery,
    LodexJoinQuery,
    saveDocuments,
    precomputedSelect,
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
    LodexRunQueryPrecomputed: runQueryPrecomputed.runQueryPrecomputed,
    LodexReduceQuery: reduceQuery.reduceQuery,
    LodexOutput: formatOutput.formatOutput,
    LodexBuildContext: buildContext.buildContext,
    LodexInjectSyndicationFrom: injectSyndicationFrom.injectSyndicationFrom,
    LodexInjectCountFrom: injectCountFrom.injectCountFrom,
    LodexAggregateQuery: aggregateQuery.aggregateQuery,
    LodexSaveDocuments: saveDocuments.saveDocuments,
    LodexPrecomputedSelect: precomputedSelect.precomputedSelect,
};

export default funcs;

module.exports = funcs;
