import COLUMN from './COLUMN';
import getOtherLine from './getOtherLine';
import asyncCompose from '../lib/asyncCompose';

export default (context, [ref, idCol, uriField = { name: 'column', value: 'uri' }]) =>
    asyncCompose([
        COLUMN(context, [{ name: 'column', value: ref.value }]),
        getOtherLine(context, idCol.value),
        COLUMN(context, [uriField]),
    ]);
