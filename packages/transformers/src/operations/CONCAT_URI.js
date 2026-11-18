import CONCAT from './CONCAT.js';
import JOIN from './JOIN.js';
import composeTransformers from './composeTransformers.js';
import documentationByOperation from './documentationByOperation.js';

const transformation = (context, args) =>
    composeTransformers([
        CONCAT(context, args.slice(1)),
        JOIN(context, [args[0]]),
    ]);

transformation.getMetas = () => ({
    name: 'CONCAT_URI',
    type: 'value',
    args: [
        { name: 'separator', type: 'string' },
        { name: 'column', type: 'column' },
        { name: 'column', type: 'column' },
    ],
    docUrl: documentationByOperation['CONCAT_URI'],
});

export default transformation;
