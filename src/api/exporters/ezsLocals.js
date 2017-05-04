import { promises as jsonld } from 'jsonld';
import path from 'path';
import omit from 'lodash.omit';
import { VALIDATED } from '../../common/propositionStatus';
import generateUid from '../services/generateUid';

export function filterVersions(data, feed) {
    if (data && data.versions) {
        const { versions, ...dataWithoutVersions } = data;
        const lastVersion = versions[versions.length - 1];

        feed.send({
            ...dataWithoutVersions,
            ...lastVersion,
        });
        return;
    }

    feed.send(data);
}

export function filterContributions(data, feed) {
    if (data && data.contributions) {
        const fieldsToIgnore = data.contributions
            .filter(({ status }) => status !== VALIDATED)
            .map(({ fieldName }) => fieldName)
            .concat('contributions', 'contributionCount');
        feed.send(omit(data, fieldsToIgnore));
        return;
    }

    feed.send(data);
}

export function useFieldNames(data, feed) {
    const fields = this.getParam('fields', {});

    if (this.isLast()) {
        feed.close();
        return;
    }

    const output = fields.filter(field => field.cover === 'collection').map((currentOutput, field) => ({
        ...currentOutput,
        [field.label || field.name]: data[field.name],
    }), {});

    feed.send(output);
}

export function linkDataset(data, feed) {
    const uri = this.getParam('uri');
    const scheme = this.getParam('scheme', 'http://purl.org/dc/terms/isPartOf');

    if (uri && data && data['@context']) {
        feed.send({
            ...data,
            dataset: uri,
            '@context': {
                ...data['@context'],
                dataset: {
                    '@id': scheme,
                },
            },
        });
        return;
    }

    feed.send(data);
}

async function transformCompleteFields(field) {
    const name = await generateUid();
    const complete = field.name;
    const completed = field.completes;
    return { name, complete, completed };
}

function getFieldContext(field, scheme = field.scheme) {
    const fieldContext = {
        '@id': scheme,
    };

    if (field.type) {
        fieldContext['@type'] = field.type;
    }
    if (field.language) {
        fieldContext['@language'] = field.language;
    }

    return fieldContext;
}

async function mergeCompleteField(output, field, fields, data) {
    const { name, complete, completed } = await transformCompleteFields(field);
    const completedField = fields.find(f => f.name === completed);
    const completeField = fields.find(f => f.name === complete);

    const fieldContext = getFieldContext(field, completedField.scheme);
    const completedFieldContext = getFieldContext(completedField, 'http://www.w3.org/2000/01/rdf-schema#label');
    const completeFieldContext = getFieldContext(field, completeField.scheme);

    return {
        ...output,
        [name]: {
            [complete]: data[complete],
            [completed]: data[completed],
        },
        '@context': {
            ...output['@context'],
            [name]: fieldContext,
            [complete]: completeFieldContext,
            [completed]: completedFieldContext,
        },
    };
}

function mergeSimpleField(output, field, data) {
    const propertyName = field.name;
    const fieldContext = getFieldContext(field);

    return {
        ...output,
        [propertyName]: data[propertyName],
        '@context': {
            ...output['@context'],
            [propertyName]: fieldContext,
        },
    };
}

function getUri(uri) {
    if (uri.indexOf('http://') !== 0 &&
        uri.indexOf('https://') !== 0) {
        return path.normalize(this.getParam('hostname', 'http://lod.istex.fr/').concat(uri));
    }

    return uri;
}

export async function JSONLDObject(data, feed) {
    if (this.isLast()) {
        feed.close();
        return;
    }
    const fields = this.getParam('fields', {});

    const output = await fields
        .filter(field => field.cover === 'collection')
        .reduce((currentOutputPromise, field) =>
            currentOutputPromise.then((currentOutput) => {
                const propertyName = field.name;
                const isCompletedByAnotherField = fields.some(f => f.completes === field.name);
                const completesAnotherField = field.completes;

                if (completesAnotherField) {
                    return Promise.resolve(mergeCompleteField(currentOutput, field, fields, data));
                }

                if (field.scheme && data[propertyName] && !isCompletedByAnotherField) {
                    return Promise.resolve(mergeSimpleField(currentOutput, field, data));
                }

                return Promise.resolve(currentOutput);
            }), Promise.resolve({
                '@id': getUri(data.uri),
            }));

    feed.send(output);
}

export function JSONLDString(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }

    jsonld.toRDF(data, { format: 'application/nquads' })
        .then((out) => {
            feed.send(out);
        },
            (err) => {
                throw err;
            });
}

export function JSONLDCompacter(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }

    jsonld.compact(data, {})
        .then((out) => {
            feed.send(out);
        },
            (err) => {
                throw err;
            });
}

export function extractIstexQuery(data, feed) {
    if (this.isLast()) {
        feed.close();
    } else {
        const fields = this.getParam('fields', {});

        fields
      .filter(field => field.format && field.format.name === 'istex')
      .forEach((field) => {
          const propertyName = field.name;
          /* eslint-disable*/
          console.log(data[propertyName]);
          /* eslint-enable */
      });
        feed.send(data);
    }
}

