import contextualBarchart from './contextual-bar-chart';
import globalPiechart from './global-pie-chart/';
import globalRadarchart from './global-radar-chart/';
import emphasedNumber from './emphased-number/';
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
import resource from './lodex-resource';
import DefaultFormat from './DefaultFormat';

const components = {
    contextualBarchart,
    globalPiechart,
    globalRadarchart,
    emphasedNumber,
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
    resource,
    resourcesGrid,
};

export const FORMATS = Object.keys(components).sort();

export const getComponent = (field) => {
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
