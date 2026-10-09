import {
    transformers as ezsTransformers,
    transformersMetas,
} from '@ezs/transformers';

export default ezsTransformers;
export const transformers = ezsTransformers;

export const hasRegistredTransformer = (operation: any) =>
    // @ts-expect-error TS7053
    typeof transformers[operation] !== 'undefined';

export const getTransformersMetas = (type: any) =>
    type
        ? transformersMetas.filter((m: any) => m.type === type)
        : transformersMetas;

export const getTransformerMetas = (operation: any) => {
    // @ts-expect-error TS7053
    const transformer = transformers[operation];
    if (!transformer) return [];

    return transformer.getMetas();
};
