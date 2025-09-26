export function getPercentValue(value, decimals = 0) {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 1) {
        return '0';
    }
    const percent = parsedValue * 100;
    return percent.toFixed(decimals);
}
