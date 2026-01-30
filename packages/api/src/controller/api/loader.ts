import Koa from 'koa';
import route from 'koa-route';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'.
import ezs from '@ezs/core';
import ezsLodex from '@ezs/lodex';
import config from 'config';

import { getHost, getCleanHost } from '@lodex/common';
import Script from '../../services/script';

ezs.use(ezsLodex);

const loaders = new Script('loaders');

export const getLoadersConfig = () => ({
    host: getCleanHost(),
    rawHost: getHost(),
    cleanHost: getCleanHost(),
});

export const getLoader = async (type: any) => {
    const loader = await loaders.get(type);
    if (!loader) {
        throw new Error(`Unsupported document type: ${type}`);
    }

    const [, metaData, , script] = loader;

    const loaderStreamFactory = (
        config: any,
        fields: any,
        characteristics: any,
        stream: any,
    ) =>
        stream
            .pipe(ezs('filterVersions'))
            .pipe(ezs('filterContributions', { fields }))
            .pipe(
                ezs(
                    'delegate',
                    { script },
                    {
                        cleanHost: config.cleanHost, // useless ?
                        fields, // useless ?
                        characteristics, // useless ?
                    },
                ),
            );

    loaderStreamFactory.extension = metaData.extension;
    loaderStreamFactory.mimeType = metaData.mimeType;
    loaderStreamFactory.type = metaData.type;
    loaderStreamFactory.label = metaData.label;

    return loaderStreamFactory;
};

export async function setup(ctx: any, next: any) {
    ctx.getLoader = getLoader;
    ctx.getLoadersConfig = getLoadersConfig;
    await next();
}

export async function getLoaders(ctx: any) {
    const configuredLoaders: string[] = config.get('scripts.loaders');

    const availableLoaderStreamFactoryPromises = configuredLoaders.map(
        (loader: any) => ctx.getLoader(loader),
    );
    const availableLoaders = await Promise.all(
        availableLoaderStreamFactoryPromises,
    );

    ctx.body = availableLoaders
        .filter((loader: any) => loader.label !== undefined)
        .map((loader: any) => ({
            name: loader.label,
        }));
}

export async function getLoaderWithScript(ctx: any, name: any) {
    const currentLoader = await loaders.get(name);
    if (!currentLoader) {
        ctx.status = 404;
        throw new Error(`Unknown loader: ${name}`);
    }

    const [, , loaderName, script] = currentLoader;
    ctx.body = { name: loaderName, script };
    ctx.status = 200;
}

const app = new Koa();

app.use(setup);
app.use(route.get('/', getLoaders));
app.use(route.get('/:name', getLoaderWithScript));

export default app;
