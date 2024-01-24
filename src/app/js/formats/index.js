import get from 'lodash.get';

import merge from '../lib/merge';
import { FORMATS_CATALOG } from './formats';
import checkPredicate from './checkPredicate';
import DefaultFormat from './utils/components/default-format';

export const FORMATS = FORMATS_CATALOG.sort((a, b) =>
    a.componentName.toLowerCase().localeCompare(b.componentName.toLowerCase()),
);

const TABLE_COMPATIBLE_FORMATS = [
    'title',
    'uri',
    'list',
    'markdown',
    'html',
    'link',
    'latex',
    'emphasedNumber',
    'paragraph',
    'code',
];

export const COMPATIBLE_FORMATS = FORMATS_CATALOG.filter(format =>
    TABLE_COMPATIBLE_FORMATS.includes(format.componentName),
);

export const getFormatInitialArgs = name => {
    const format = FORMATS_CATALOG.find(f => f.componentName === name);
    if (!format) {
        return {};
    }

    return format.component?.defaultArgs || {};
};

export const getComponent = field => {
    if (!field) {
        return DefaultFormat;
    }
    if (typeof field === 'string') {
        return (
            FORMATS_CATALOG.find(i => i.componentName === field)?.component ||
            DefaultFormat
        );
    }

    if (!field.format || !field.format.name) {
        return DefaultFormat;
    }

    return (
        FORMATS_CATALOG.find(i => i.componentName === field.format.name)
            ?.component || DefaultFormat
    );
};

export const getViewComponent = (field, isList) => {
    const { defaultArgs, Component, ListComponent, predicate } = getComponent(
        field,
    );

    const args = merge(defaultArgs, get(field, 'format.args', {}));

    const ViewComponent = isList ? ListComponent || Component : Component;

    return {
        ViewComponent: checkPredicate(
            predicate,
            ViewComponent,
            field.format,
            'view',
        ),
        args,
    };
};

export const getAdminComponent = name => getComponent(name).AdminComponent;
export const getEditionComponent = field =>
    getComponent(field).EditionComponent;
export const getIconComponent = name => getComponent(name).Icon;
export const getPredicate = name => getComponent(name).predicate;
