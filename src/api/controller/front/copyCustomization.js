import copy from 'recursive-copy';
import path from 'path';

export default () => {
    const source = path.resolve(__dirname, '../../../../custom');
    const destination = path.resolve(__dirname, '../../../app');

    return copy(source, destination, {
        overwrite: process.env.NODE_ENV === 'development',
    });
};
