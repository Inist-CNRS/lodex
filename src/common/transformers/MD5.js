import md5 from 'md5';

const MD5 = () => value => (Array.isArray(value) ? value.map(md5) : md5(value));

MD5.getMetas = () => ({
    name: 'MD5',
    type: 'value',
    args: [],
});

export default MD5;
