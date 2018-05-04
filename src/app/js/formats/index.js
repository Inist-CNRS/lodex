import get from 'lodash.get';
import merge from '../lib/merge';

import code from './code';
import globalBarchart from './distributionChart/global-bar-chart/';
import globalPiechart from './distributionChart/global-pie-chart/';
import globalRadarchart from './distributionChart/global-radar-chart/';
import emphasedNumber from './emphased-number/';
import identifierBadge from './identifier-badge/';
import resourcesGrid from './resources-grid/';
import email from './email';
import html from './html';
import image from './image';
import istex from './istex';
import link from './link';
import linkImage from './link-image';
import list from './list';
import trelloTimeline from './trello-timeline';
import markdown from './markdown';
import uri from './uri';
import title from './title';
import paragraph from './paragraph';
import sentence from './sentence';
import resource from './lodex-resource';
import cartography from './cartography';
import heatmap from './heatmap';
import network from './network';
import redirect from './redirect';
import bubbleChart from './bubbleChart';
import sparqlTextField from './sparql/sparqlTextField/';
import DefaultFormat from './DefaultFormat';

const components = {
    code,
    globalBarchart,
    globalPiechart,
    globalRadarchart,
    emphasedNumber,
    identifierBadge,
    email,
    html,
    image,
    istex,
    link,
    linkImage,
    list,
    trelloTimeline,
    markdown,
    uri,
    title,
    paragraph,
    sentence,
    resource,
    resourcesGrid,
    cartography,
    heatmap,
    network,
    redirect,
    bubbleChart,
    sparqlTextField,
};

export const FORMATS = Object.keys(components).sort();

export const getFormatInitialArgs = name =>
    get(components, [name, 'defaultArgs'], {});

export const getComponent = field => {
    if (!field) {
        return DefaultFormat;
    }
    if (typeof field === 'string') {
        return components[field] || DefaultFormat;
    }

    if (!field.format || !field.format.name) {
        return DefaultFormat;
    }

    return components[field.format.name] || DefaultFormat;
};

export const getViewComponent = (field, isList) => {
    const component = getComponent(field);

    const args = merge(component.defaultArgs, get(field, 'format.args', {}));

    return {
        ViewComponent: isList
            ? component.ListComponent || component.Component
            : component.Component,
        args,
    };
};
export const getAdminComponent = name => getComponent(name).AdminComponent;
export const getEditionComponent = name => getComponent(name).EditionComponent;
