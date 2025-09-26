// @ts-expect-error TS(2792): Cannot find module 'koa'. Did you mean to set the ... Remove this comment to see the full error message
import Koa from 'koa';
// @ts-expect-error TS(2792): Cannot find module 'koa-route'. Did you mean to se... Remove this comment to see the full error message
import route from 'koa-route';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message

import ezs from '@ezs/core';
// @ts-expect-error TS(2792): Cannot find module '@ezs/lodex'. Did you mean to s... Remove this comment to see the full error message
import ezsLodex from '@ezs/lodex';

// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { getHost, getCleanHost } from '../../../common/uris';
import config from '../../../../config.json';
import Script from '../../services/script';

ezs.use(ezsLodex);

const loaders = new Script('loaders');

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

export async function setup(ctx: any, next: any) {
    ctx.getLoader = getLoader;
    ctx.getLoadersConfig = getLoadersConfig;
    await next();
}

export async function getLoaders(ctx: any) {
    const configuredLoaders = config.loaders || [];

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
