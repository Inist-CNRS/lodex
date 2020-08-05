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

export const MAP_EUROPE = 'europe';
export const MAP_WORLD = 'world';
export const MAP_FRANCE = 'france';

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
