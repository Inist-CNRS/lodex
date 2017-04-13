import COLUMN from './COLUMN';
import getOtherLine from './getOtherLine';
import composeTransformer from '../lib/composeTransformer';

const transformation = (context, [ref, idCol, uriField = { name: 'column', value: 'uri' }]) =>
    composeTransformer([
        COLUMN(context, [{ name: 'column', value: ref.value }]),
        getOtherLine(context, idCol.value),
        COLUMN(context, [uriField]),
    ]);

transformation.getMetas = () => ({
    name: 'LINK',
    type: 'value',
    args: [
        { name: 'reference', type: 'column' },
        { name: 'identifier', type: 'column' },
    ],
});

export default transformation;
