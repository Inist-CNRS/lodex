import { transformers, transformersMetas } from '@ezs/transformers';
import AUTOGENERATE_URI from './AUTOGENERATE_URI';

transformers.AUTOGENERATE_URI = AUTOGENERATE_URI;
transformersMetas.push(AUTOGENERATE_URI.getMetas());

export default transformers;

export const hasRegistredTransformer = operation =>
    typeof transformers[operation] !== 'undefined';

export const getTransformersMetas = type =>
    type ? transformersMetas.filter(m => m.type === type) : transformersMetas;

export const getTransformerMetas = operation => {
    const transformer = transformers[operation];
    if (!transformer) return [];

    return transformer.getMetas();
};
