import CONCAT from './CONCAT';
import JOIN from './JOIN';
import asyncCompose from '../lib/asyncCompose';

const transformation = (context, args) =>
    asyncCompose([
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
