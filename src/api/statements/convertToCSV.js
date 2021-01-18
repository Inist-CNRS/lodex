import omit from 'lodash.omit';
import { SCOPE_DATASET } from '../../common/scope';

import { VALIDATED } from '../../common/propositionStatus';

export const removeContributions = (doc, contributions) => {
    const fieldsToIgnore = contributions
        .filter(({ status }) => status !== VALIDATED)
        .map(({ fieldName }) => fieldName);

    return omit(doc, fieldsToIgnore);
};

export const getLastVersionFactory = defaultDocument =>
    function getLastVersion({ uri, versions, contributions = [] }) {
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
    };

export const getCsvFieldFactory = getCharacteristicByName => ({
    scope,
    label,
    name,
}) => ({
    filter: value =>
        scope === SCOPE_DATASET ? getCharacteristicByName(name) : value,
    label: label || name,
    name,
    quoted: true,
});

export const getDefaultDocuments = fields =>
    Object.keys(fields).reduce((acc, key) => ({
        [key]: '',
    }));
