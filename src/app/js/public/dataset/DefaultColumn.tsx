import classnames from 'classnames';
import { TableCell } from '@mui/material';

import Format from '../Format';
import getFieldClassName from '../../lib/getFieldClassName';

interface DatasetColumnProps {
    column: unknown;
    columns: unknown[];
    resource: object;
}

const DatasetColumn = ({ column, columns, resource }: DatasetColumnProps) => (
    <TableCell
        className={classnames(
            'dataset-column',
            `dataset-${getFieldClassName(column)}`,
        )}
    >
        <Format
            isList
            field={column}
            // @ts-expect-error TS2322
            fields={columns}
            resource={resource}
            shrink
        />
    </TableCell>
);

export default DatasetColumn;
