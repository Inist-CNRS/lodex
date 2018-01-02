import set from 'lodash.set';

export const uniqConcat = (array, item) =>
    array.indexOf(item) === -1 ? array.concat(item) : array;

export const mapSourceToX = (acc, { source, target, weight }) => ({
    xAxis: uniqConcat(acc.xAxis, source),
    yAxis: uniqConcat(acc.yAxis, target),
    dictionary: set(acc.dictionary, [source, target], weight),
    maxValue: weight > acc.maxValue ? weight : acc.maxValue,
});

export const mapTargetToX = (acc, { source, target, weight }) => ({
    xAxis: uniqConcat(acc.xAxis, target),
    yAxis: uniqConcat(acc.yAxis, source),
    dictionary: set(acc.dictionary, [target, source], weight),
    maxValue: weight > acc.maxValue ? weight : acc.maxValue,
});
