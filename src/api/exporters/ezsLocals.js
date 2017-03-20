import { promises as jsonld } from 'jsonld';
import path from 'path';
import omit from 'lodash.omit';
import { VALIDATED } from '../../common/propositionStatus';


export function filterVersions(data, feed) {
    if (data && data.versions) {
        const lastVersion = data.versions[data.versions.length - 1];
        delete data.versions;
        feed.send({
            ...data,
            ...lastVersion,
        });
    } else {
        feed.send(data);
    }
}

export function filterContributions(data, feed) {
    if (data && data.contributions) {
        const fieldsToIgnore = data.contributions
            .filter(({ status }) => status !== VALIDATED)
            .map(({ fieldName }) => fieldName)
            .concat('contributions', 'contributionCount');
        feed.send(omit(data, fieldsToIgnore));
    } else {
        feed.send(data);
    }
}

export function useFieldNames(data, feed) {
    const fields = this.getParam('fields', {});
    const output = {};
    if (this.isLast()) {
        feed.close();
    } else {
        fields.filter(field => field.cover === 'collection').forEach((field) => {
            output[field.label || field.name] = data[field.name];
        });
        feed.send(output);
    }
}

export function linkDataset(data, feed) {
    const uri = this.getParam('uri');
    const scheme = this.getParam('scheme', 'http://purl.org/dc/terms/isPartOf');
    if (uri && data && data['@context']) {
        data.dataset = uri;
        data['@context'].dataset = {
            '@id': scheme,
//             '@type': 'https://www.w3.org/TR/xmlschema-2/#anyURI',
        };
    }
    feed.send(data);
}

export function JSONLDObject(data, feed) {
    if (this.isLast()) {
        feed.close();
    } else {
        const output = {};

        if (data.uri.indexOf('http://') !== 0 &&
            data.uri.indexOf('https://') !== 0) {
            data.uri = path.normalize(this.getParam('hostname', 'http://lod.istex.fr/').concat(data.uri));
        }
        output['@id'] = data.uri;
        output['@context'] = {};

        const fields = this.getParam('fields', {});

        fields.filter(field => field.cover === 'collection').forEach((field) => {
            const propertyName = field.name;
            if (field.scheme && data[propertyName]) {
                output[propertyName] = data[propertyName];
                output['@context'][propertyName] = {};
                output['@context'][propertyName]['@id'] = field.scheme;
                if (field.type) {
                    output['@context'][propertyName]['@type'] = field.type;
                }
                if (field.language) {
                    output['@context'][propertyName]['@language'] = field.language;
                }
            }
        });
        feed.send(output);
    }
}


export function JSONLDString(data, feed) {
    if (this.isLast()) {
        feed.close();
    } else {
        jsonld.toRDF(data, { format: 'application/nquads' })
            .then((out) => {
                feed.send(out);
            },
            (err) => {
                throw err;
            });
    }
}

