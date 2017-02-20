import { call, select } from 'redux-saga/effects';

import {
    fromFields,
} from '../..';

export function* prepareTransformer(transformer) {
    const args = yield select(fromFields.getTransformerArgs, transformer.operation);
    const originalArgs = transformer.args || args;

    const newTransformer = {
        ...transformer,
        args: (args || []).map(a => ({
            ...a,
            value: (originalArgs.find(originalArg => a.name === originalArg.name) || { value: '' }).value,
        })),
    };

    return newTransformer;
}

export default function* prepareTransformers(transformers) {
    if (!transformers || transformers.length === 0) {
        return [];
    }

    return yield transformers.map(transformer => call(prepareTransformer, transformer));
}
