import get from 'lodash.get';

export function getPercentValue(data, decimals = 0) {
    const weight = get(data, 'weight', 0);
    const parsedValue = parseFloat(weight);
    if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 1) {
        return '0';
    }
    const percent = parsedValue * 100;
    return percent.toFixed(decimals);
}
