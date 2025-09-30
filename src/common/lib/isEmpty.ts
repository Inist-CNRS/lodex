export default (value: any) => value === null ||
typeof value === 'undefined' ||
value === '' ||
(Array.isArray(value) && value.length === 0);
