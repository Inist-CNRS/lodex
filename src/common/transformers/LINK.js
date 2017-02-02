import COLUMN from './COLUMN';
import getOtherLine from './getOtherLine';
import asyncCompose from '../lib/asyncCompose';

export default (context, ref, idCol, uriField = 'uri') =>
    asyncCompose([
        COLUMN(context, ref),
        getOtherLine(context, idCol),
        COLUMN(context, uriField),
    ]);
