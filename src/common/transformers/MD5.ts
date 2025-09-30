// @ts-expect-error TS(2792): Cannot find module 'md5'. Did you mean to set the ... Remove this comment to see the full error message
import md5 from 'md5';

const MD5 = () => (value: any) =>
    Array.isArray(value) ? value.map(md5) : md5(value);

MD5.getMetas = () => ({
    name: 'MD5',
    type: 'value',
    args: [],
});

export default MD5;
