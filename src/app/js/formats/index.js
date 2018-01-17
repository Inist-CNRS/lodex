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
<<<<<<< HEAD
<<<<<<< 49257a75b48635dc6fe312c85485a64518c30efe
import bubbleChart from './bubbleChart';
=======
import code from './code';
>>>>>>> new format to display code (xml)
=======
import code from './code';
>>>>>>> fc61b6757134a0f03fd8ee1ce62fdc3056fd9900
import DefaultFormat from './DefaultFormat';

const components = {
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
<<<<<<< HEAD
<<<<<<< 49257a75b48635dc6fe312c85485a64518c30efe
    bubbleChart,
=======
    code,
>>>>>>> new format to display code (xml)
=======
    code,
>>>>>>> fc61b6757134a0f03fd8ee1ce62fdc3056fd9900
};

export const FORMATS = Object.keys(components).sort();

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
    if (isList) {
        return component.ListComponent || component.Component;
    }

    return component.Component;
};
export const getAdminComponent = name => getComponent(name).AdminComponent;
export const getEditionComponent = name => getComponent(name).EditionComponent;
