// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { TableCell } from '@mui/material';

import Format from '../Format';
import { field as fieldPropTypes } from '../../propTypes';
import getFieldClassName from '../../lib/getFieldClassName';

// @ts-expect-error TS7031
const DatasetColumn = ({ column, columns, resource }) => (
    <TableCell
        className={classnames(
            'dataset-column',
            `dataset-${getFieldClassName(column)}`,
        )}
    >
        <Format
            // @ts-expect-error TS2322
            isList
            field={column}
            fields={columns}
            resource={resource}
            shrink
        />
    </TableCell>
);

DatasetColumn.propTypes = {
    column: fieldPropTypes.isRequired,
    columns: PropTypes.arrayOf(fieldPropTypes).isRequired,
    resource: PropTypes.object.isRequired,
};

export default DatasetColumn;
