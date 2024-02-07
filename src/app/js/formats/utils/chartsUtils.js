import { clamp, cloneDeep } from 'lodash';

// Values given when an error are encounter
export const INVALID_VALUE = -1;

// Charts axis direction
export const AXIS_HORIZONTAL = 0;
export const AXIS_VERTICAL = 1;

// Axis type (doc: https://vega.github.io/vega-lite/docs/type.html)
export const AXIS_GEOJSON = 'geojson';
export const AXIS_NOMINAL = 'nominal';
export const AXIS_ORDINAL = 'ordinal';
export const AXIS_QUANTITATIVE = 'quantitative';
export const AXIS_TEMPORAL = 'temporal';

// Charts order by
export const VALUES_ASC = 2;
export const VALUES_DESC = 3;
export const LABEL_ASC = 4;
export const LABEL_DESC = 5;

// Axis (with a normalized id)
export const AXIS_X = 6;
export const AXIS_Y = 7;

// Padding direction
export const PADDING_LEFT = 8;
export const PADDING_RIGHT = 9;
export const PADDING_TOP = 10;
export const PADDING_BOTTOM = 11;

// Chart scale
export const SCALE_LINEAR = 12;
export const SCALE_LOG = 13;

export const VALUES = 14;
export const CATEGORIES = 15;

// Data injection for Bar, Pie, HeatMap chart
export const VEGA_LITE_DATA_INJECT_TYPE_A = 16;
export const VEGA_LITE_DATA_INJECT_TYPE_B = 17;
export const VEGA_LITE_DATA_INJECT_TYPE_C = 19;

// Data injection for Radar Chart
export const VEGA_DATA_INJECT_TYPE_A = 18;
export const VEGA_DATA_INJECT_TYPE_B = 20;

// Map type
export const MAP_EUROPE = 'europe';
export const MAP_WORLD = 'world';
export const MAP_FRANCE = 'france';

// Vega Chart constant
export const VEGA_ACTIONS_WIDTH = 40;

// function use to convert scale give by lodex to an normalized id
export const lodexScaleToIdScale = scale => {
    switch (scale) {
        case 'linear':
            return SCALE_LINEAR;
        case 'log':
            return SCALE_LOG;
    }
};

// function use to convert orderBy give by lodex to an normalized id
export const lodexOrderToIdOrder = orderBy => {
    switch (orderBy) {
        case 'value/asc':
            return VALUES_ASC;
        case 'value/desc':
            return VALUES_DESC;
        case '_id/asc':
            return LABEL_ASC;
        case '_id/desc':
            return LABEL_DESC;
        default:
            return INVALID_VALUE;
    }
};

/**
 * Convert text value to code value
 * @param direction{'vertical' | 'horizontal'}
 * @returns {number}
 */
export const lodexDirectionToIdDirection = direction => {
    switch (direction) {
        case 'vertical':
            return AXIS_VERTICAL;
        case 'horizontal':
            return AXIS_HORIZONTAL;
        default:
            return INVALID_VALUE;
    }
};

const WIDTH_REGEX = /\{\|__LODEX_WIDTH__\|}/g;
const HEIGHT_REGEX = /\{\|__LODEX_HEIGHT__\|}/g;

/**
 * Convert the spec string into a json and at the same time replace template variable
 * @param spec {string} Spec to convert in json
 * @param width {number} Width of the chart container
 * @param height {number} Height of the chart container
 * @returns {any} The Vega Lite spec as a json object
 */
export const convertSpecTemplate = (spec, width, height) => {
    const specCopy = cloneDeep(spec);

    const specWithTemplate = JSON.parse(specCopy);
    const specWithNumberSize = {};

    if (specWithTemplate.width === '{|__LODEX_WIDTH__|}') {
        specWithNumberSize.width = clamp(width, 100, 1200);
    }

    if (specWithTemplate.height === '{|__LODEX_HEIGHT__|}') {
        specWithNumberSize.height = clamp(height, 100, 1200);
    }

    const specWithoutTemplate = JSON.parse(
        specCopy
            .replace(WIDTH_REGEX, clamp(width, 100, 1200))
            .replace(HEIGHT_REGEX, clamp(height, 100, 1200)),
    );

    return {
        ...specWithoutTemplate,
        ...specWithNumberSize,
    };
};

export const flip = (condition, defaultValue, flipValue) => {
    return condition ? flipValue : defaultValue;
};
