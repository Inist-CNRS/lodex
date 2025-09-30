import omit from 'lodash/omit.js';

// import { VALIDATED } from '../../common/propositionStatus'; // IN LODEX
const VALIDATED = 'VALIDATED';

export const removeContributions = (doc: any, contributions: any) => {
    const fieldsToIgnore = contributions
        .filter(({
        status
    }: any) => status !== VALIDATED)
        .map(({
        fieldName
    }: any) => fieldName);

    return omit(doc, fieldsToIgnore);
};

export const getLastVersionFactory = (defaultDocument: any) => (function getLastVersion(
    this: any,
    {
        uri,
        versions,
        contributions = []
    }: any
) {
        const lastVersion = versions[versions.length - 1];
        const lastVersionWithoutContribution = removeContributions(
            lastVersion,
            contributions,
        );

        this.queue({
            ...defaultDocument,
            ...lastVersionWithoutContribution,
            uri,
        });
    });

export const getCsvFieldFactory =
    (getCharacteristicByName: any) => ({
        cover,
        label,
        name
    }: any) => ({
        filter: (value: any) => cover === 'dataset' ? getCharacteristicByName(name) : value,
        label: label || name,
        name,
        quoted: true,
    });

// @ts-expect-error TS(6133): 'acc' is declared but its value is never read.
export const getDefaultDocuments = (fields: any) => Object.keys(fields).reduce((acc, key) => ({
    [key]: '',
}));
