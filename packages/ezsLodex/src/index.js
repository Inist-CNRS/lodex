import flattenPatch from './flatten-patch.js';
import objects2columns from './objects2columns.js';
import convertToAtom from './convertToAtom.js';
import convertToJson from './convertToJson.js';
import convertToSitemap from './convertToSitemap.js';
import extractIstexQuery from './extractIstexQuery.js';
import filterContributions from './filterContributions.js';
import filterVersions from './filterVersions.js';
import linkDataset from './linkDataset.js';
import useFieldNames from './useFieldNames.js';
import disabled from './disabled.js';
import runQuery from './runQuery.js';
import runQueryPrecomputed from './runQueryPrecomputed.js';
import reduceQuery from './reduceQuery.js';
import formatOutput from './formatOutput.js';
import getLastCharacteristic from './getLastCharacteristic.js';
import keyMapping from './keyMapping.js';
import getFields from './getFields.js';
import getCharacteristics from './getCharacteristics.js';
import injectDatasetFields from './injectDatasetFields.js';
import injectSyndicationFrom from './injectSyndicationFrom.js';
import injectCountFrom from './injectCountFrom.js';
import labelizeFieldID from './labelizeFieldID.js';
import buildContext from './buildContext.js';
import aggregateQuery from './aggregateQuery.js';
import LodexJoinQuery from './joinQuery.js';
import saveDocuments from './saveDocuments.js';
import precomputedSelect from './precomputedSelect.js';
import homogenizedObject from './homogenizedObject.js';
import updateDocument from './updateDocument.js';
import updateDocuments from './updateDocuments.js';

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
    homogenizedObject,
    updateDocument,
    updateDocuments,
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
    LodexHomogenizedObject: homogenizedObject.homogenizedObject,
    LodexUpdateDocument: updateDocument.updateDocument,
    LodexUpdateDocuments: updateDocuments.updateDocuments,
};

export default funcs;

//module.exports = funcs;
