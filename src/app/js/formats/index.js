import html from './html';
import email from './email';
import link from './link';
import list from './list';
import uri from './uri';
import istex from './istex';
import DefaultFormat from './DefaultFormat';

const components = {
    html,
    list,
    uri,
    email,
    link,
    istex,
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
