import Koa from 'koa';
import route from 'koa-route';
import ezs from '@ezs/core';
import ezsLodex from '@ezs/lodex';

import { getHost, getCleanHost } from '../../../common/uris';
import config from '../../../../config.json';
import Script from '../../services/script';

ezs.use(ezsLodex);

const loaders = new Script('loaders', '../../../../scripts/loaders');

export const getLoader = async type => {
    const loader = await loaders.get(type);
    if (!loader) {
        throw new Error(`Unsupported document type: ${type}`);
    }

    const [, metaData, , script] = loader;

    const loaderStreamFactory = (config, fields, characteristics, stream) =>
        stream
            .pipe(ezs('filterVersions'))
            .pipe(ezs('filterContributions', { fields }))
            .pipe(
                ezs(
                    'delegate',
                    { script },
                    {
                        cleanHost: config.cleanHost,
                        collectionClass: config.collectionClass,
                        datasetClass: config.datasetClass,
                        exportDataset: config.exportDataset,
                        schemeForDatasetLink: config.schemeForDatasetLink,
                        labels: config.istexQuery.labels,
                        linked: config.istexQuery.linked,
                        context: config.istexQuery.context,
                        fields,
                        characteristics,
                    },
                ),
            );

    loaderStreamFactory.extension = metaData.extension;
    loaderStreamFactory.mimeType = metaData.mimeType;
    loaderStreamFactory.type = metaData.type;
    loaderStreamFactory.label = metaData.label;

    return loaderStreamFactory;
};

export const getLoadersConfig = () => ({
    ...config,
    host: getCleanHost(),
    rawHost: getHost(),
    cleanHost: getCleanHost(),
});

export async function setup(ctx, next) {
    ctx.getLoader = getLoader;
    ctx.getLoadersConfig = getLoadersConfig;
    await next();
}

export async function getLoaders(ctx) {
    const configuredLoaders = config.loaders || [];

    const availableLoaderStreamFactoryPromises = configuredLoaders.map(loader =>
        ctx.getLoader(loader),
    );
    const availableLoaders = await Promise.all(
        availableLoaderStreamFactoryPromises,
    );

    ctx.body = availableLoaders
        .filter(loader => loader.label !== undefined)
        .map(loader => ({
            name: loader.label,
        }));
}

export async function getLoaderWithScript(ctx, name) {
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
