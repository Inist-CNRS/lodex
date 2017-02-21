import parseCsv from './parseCsv'; // eslint-disable-line


export default {
    'text/csv': parseCsv,
    'text/tab-separated-values': parseCsv,
};
