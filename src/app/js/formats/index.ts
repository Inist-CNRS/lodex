import get from 'lodash/get';

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

export const COMPATIBLE_FORMATS = FORMATS_CATALOG.filter((format) =>
    TABLE_COMPATIBLE_FORMATS.includes(format.componentName),
);

// @ts-expect-error TS7006
export const getFormatInitialArgs = (name) => {
    const format = FORMATS_CATALOG.find((f) => f.componentName === name);
    if (!format) {
        return {};
    }

    return format.component?.defaultArgs || {};
};

// @ts-expect-error TS7006
export const getComponent = (field) => {
    if (!field) {
        return DefaultFormat;
    }
    if (typeof field === 'string') {
        return (
            FORMATS_CATALOG.find((i) => i.componentName === field)?.component ||
            DefaultFormat
        );
    }

    if (!field.format || !field.format.name) {
        return DefaultFormat;
    }

    return (
        FORMATS_CATALOG.find((i) => i.componentName === field.format.name)
            ?.component || DefaultFormat
    );
};

// @ts-expect-error TS7006
export const getViewComponent = (field, isList) => {
    const { defaultArgs, Component, ListComponent, predicate } =
        getComponent(field);

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
// @ts-expect-error TS7031
export const getReadableValue = ({ field, resource }) => {
    const { getReadableValue, defaultArgs } = getComponent(field);

    const args = merge(defaultArgs, get(field, 'format.args', {}));

    return getReadableValue({ field, resource, ...args });
};

// @ts-expect-error TS7006
export const getAdminComponent = (name) => getComponent(name).AdminComponent;
// @ts-expect-error TS7006
export const getIconComponent = (name) => getComponent(name).Icon;
// @ts-expect-error TS7006
export const getPredicate = (name) => getComponent(name).predicate;

// @ts-expect-error TS7006
export const getIsFieldValueAnnotable = (name) => {
    if (!name) {
        return true;
    }
    if (name === 'None') {
        return true;
    }
    return (
        FORMATS_CATALOG.find((i) => i.componentName === name)
            ?.isValueAnnotable ?? false
    );
};
// @ts-expect-error TS7006
export const getIsFieldValueAnUrl = (name) => {
    if (!name) {
        return false;
    }
    return (
        FORMATS_CATALOG.find((i) => i.componentName === name)?.isUrlValue ??
        false
    );
};
