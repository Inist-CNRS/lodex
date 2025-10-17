export const isEmpty = (value: any) =>
    value === null ||
    typeof value === 'undefined' ||
    value === '' ||
    (Array.isArray(value) && value.length === 0);

export default isEmpty;
