import COLUMN from './COLUMN';
import getOtherLine from './getOtherLine';
import asyncCompose from '../lib/asyncCompose';

const transformation = (context, [ref, idCol, uriField = { name: 'column', value: 'uri' }]) =>
    asyncCompose([
        COLUMN(context, [{ name: 'column', value: ref.value }]),
        getOtherLine(context, idCol.value),
        COLUMN(context, [uriField]),
    ]);

transformation.getMetas = () => ({
    name: 'LINK',
    args: [
        { name: 'reference', type: 'column' },
        { name: 'identifier', type: 'column' },
    ],
});

export default transformation;
