export const MONOCHROMATIC_DEFAULT_COLORSET = '#2b83ba';

export const MULTICHROMATIC_DEFAULT_COLORSET =
    '#d7191c #fdae61 #ffffbf #abdda4 #2b83ba';

export const MULTICHROMATIC_DEFAULT_COLORSET_STREAMGRAPH =
    '#e6194b #3cb44b #ffe119 #4363d8 #f58231 #911eb4 #46f0f0 #f032e6 #bcf60c #fabebe #008080 #e6beff #9a6324 #fffac8 #800000 #aaffc3 #808000 #ffd8b1 #000075 #808080 #ffffff #000000';

export const isValidColor = (colorInput) =>
    /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(colorInput);

export const getColor = (colorSet, index) => {
    const color = colorSet[index % colorSet.length];
    return isValidColor(color) ? color : 'black';
};
