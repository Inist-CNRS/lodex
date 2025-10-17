import { transformers, transformersMetas } from '@ezs/transformers';
import AUTOGENERATE_URI from './AUTOGENERATE_URI';
import MD5 from './MD5';

// @ts-expect-error TS2339
transformers.AUTOGENERATE_URI = AUTOGENERATE_URI;
// @ts-expect-error TS(2339): Property 'getMetas' does not exist on type '() => ... Remove this comment to see the full error message
transformersMetas.push(AUTOGENERATE_URI.getMetas());

// @ts-expect-error TS2339
transformers.MD5 = MD5;
// @ts-expect-error TS2345
transformersMetas.push(MD5.getMetas());

export default transformers;

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
