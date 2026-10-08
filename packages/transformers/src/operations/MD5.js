import { transformer } from './transformer';
import md5 from 'md5';
import documentationByOperation from './documentationByOperation';

export const MD5 = () => (value) =>
    Array.isArray(value) ? value.map(md5) : md5(value);

const transformation = () => (value) => transformer(MD5, value);

transformation.getMetas = () => ({
    name: 'MD5',
    type: 'value',
    args: [],
    docUrl: documentationByOperation['MD5'],
});

export default transformation;

// @ts-expect-error TS(2792): Cannot find module 'md5'. Did you mean to set the ... Remove this comment to see the full error message
