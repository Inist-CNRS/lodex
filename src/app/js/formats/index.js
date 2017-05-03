import chart from './chart';
import email from './email';
import html from './html';
import image from './image';
import istex from './istex';
import link from './link';
import list from './list';
import trelloTimeline from './trello-timeline';
import uri from './uri';

import DefaultFormat from './DefaultFormat';

const components = {
    chart,
    email,
    html,
    image,
    istex,
    link,
    list,
    trelloTimeline,
    uri,
};

export const FORMATS = Object.keys(components);

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
