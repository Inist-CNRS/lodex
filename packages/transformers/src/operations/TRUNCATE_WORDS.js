import { transformerWithArg } from './transformer';
import documentationByOperation from './documentationByOperation';

export const truncateWords = (value, gap) => {
    const words = String(value).split(/\s+/);
    return words.slice(0, gap).join(' ');
};

const transformation = (_, args) => (value) =>
    transformerWithArg(truncateWords, 'gap', value, args);

transformation.getMetas = () => ({
    name: 'TRUNCATE_WORDS',
    type: 'transform',
    args: [{ name: 'gap', type: 'number' }],
    docUrl: documentationByOperation['TRUNCATE_WORDS'],
});

export default transformation;
