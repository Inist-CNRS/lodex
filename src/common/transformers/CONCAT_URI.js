import CONCAT from './CONCAT';
import JOIN from './JOIN';
import composeTransformers from '../lib/composeTransformers';

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
});

export default transformation;
