import path from 'path';
import { hostname } from 'config';
import generateUid from '../services/generateUid';

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

function removeNumberInstance(uri) {
    const reg = new RegExp('(\\-\\d+)(\\.[a-z]+)+');
    const match = reg.exec(uri);

    if (match !== null) {
        return uri.replace(match[1], '');
    }

    return uri;
}

function getUri(uri) {
    const u = removeNumberInstance(uri);

    if (u.indexOf('http://') !== 0 &&
        u.indexOf('https://') !== 0) {
        return path.normalize(hostname.concat(u));
    }

    return u;
}

function mergeCompose(output, field, data, composed) {
    const propertyName = field.name;
    const composeFields = field.composedOf.fields;
    const fieldContext = getFieldContext(field);
    let count = 0;

    return {
        ...output,
        [propertyName]: composeFields.map((e) => {
            composed.push(e);
            count += 1;
            return {
                '@id': `${getUri(data.uri)}/${e}/${count}`,
                [e]: data[e] };
        }),
        '@context': {
            ...output['@context'],
            [propertyName]: fieldContext,
        },
    };
}

module.exports = async function JSONLDObject(data, feed) {
    if (this.isLast()) {
        feed.close();
        return;
    }
    const fields = this.getParam('fields', {});
    const composeFields = [];

    const output = await fields
    .filter(field => field.cover === 'collection')
    .reduce((currentOutputPromise, field) =>
        currentOutputPromise.then((currentOutput) => {
            const propertyName = field.name;
            const isCompletedByAnotherField = fields.some(f => f.completes === field.name);
            const isComposedOf = Boolean(field.composedOf);
            const completesAnotherField = field.completes;

            if (isComposedOf) {
                return Promise.resolve(mergeCompose(currentOutput, field, data, composeFields));
            }

            /**
             * If the field is already in group fields
             */
            if (composeFields.includes(propertyName)) {
                return Promise.resolve(currentOutput);
            }

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
};
