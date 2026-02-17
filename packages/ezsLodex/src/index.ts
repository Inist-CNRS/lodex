import aggregateQuery from './aggregateQuery.js';
import buildContext from './buildContext.js';
import convertToAtom from './convertToAtom.js';
import convertToJson from './convertToJson.js';
import convertToSitemap from './convertToSitemap.js';
import disabled from './disabled.js';
import extractIstexQuery from './extractIstexQuery.js';
import filterContributions from './filterContributions.js';
import filterVersions from './filterVersions.js';
import flattenPatch from './flatten-patch.js';
import formatOutput from './formatOutput.js';
import getCharacteristics from './getCharacteristics.js';
import getFields from './getFields.js';
import getLastCharacteristic from './getLastCharacteristic.js';
import homogenizedObject from './homogenizedObject.js';
import injectCountFrom from './injectCountFrom.js';
import injectDatasetFields from './injectDatasetFields.js';
import injectSyndicationFrom from './injectSyndicationFrom.js';
import keyMapping from './keyMapping.js';
import labelizeFieldID from './labelizeFieldID.js';
import linkDataset from './linkDataset.js';
import LodexJoinQuery from './joinQuery.js';
import objects2columns from './objects2columns.js';
import precomputedSelect from './precomputedSelect.js';
import reduceQuery from './reduceQuery.js';
import runQuery from './runQuery.js';
import runQueryPrecomputed from './runQueryPrecomputed.js';
import runVSearchPrecomputed from './runVSearchPrecomputed.js';
import saveDocuments from './saveDocuments.js';
import updateDocument from './updateDocument.js';
import updateDocuments from './updateDocuments.js';
import useFieldNames from './useFieldNames.js';
import createVectorEmbeddings from './createVectorEmbeddings.js';

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
    runVSearchPrecomputed,
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
    createVectorEmbeddings,
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
