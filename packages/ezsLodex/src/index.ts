import aggregateQuery from './aggregateQuery';
import buildContext from './buildContext';
import convertToAtom from './convertToAtom';
import convertToJson from './convertToJson';
import convertToSitemap from './convertToSitemap';
import disabled from './disabled';
import extractIstexQuery from './extractIstexQuery';
import filterContributions from './filterContributions';
import filterVersions from './filterVersions';
import flattenPatch from './flatten-patch';
import formatOutput from './formatOutput';
import getCharacteristics from './getCharacteristics';
import getFields from './getFields';
import getLastCharacteristic from './getLastCharacteristic';
import homogenizedObject from './homogenizedObject';
import injectCountFrom from './injectCountFrom';
import injectDatasetFields from './injectDatasetFields';
import injectSyndicationFrom from './injectSyndicationFrom';
import keyMapping from './keyMapping';
import labelizeFieldID from './labelizeFieldID';
import linkDataset from './linkDataset';
import LodexJoinQuery from './joinQuery';
import objects2columns from './objects2columns';
import precomputedSelect from './precomputedSelect';
import reduceQuery from './reduceQuery';
import runQuery from './runQuery';
import runQueryPrecomputed from './runQueryPrecomputed';
import saveDocuments from './saveDocuments';
import updateDocument from './updateDocument';
import updateDocuments from './updateDocuments';
import useFieldNames from './useFieldNames';

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
