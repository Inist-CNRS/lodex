import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { TableCell } from '@material-ui/core';

import Format from '../Format';
import { field as fieldPropTypes } from '../../propTypes';
import getFieldClassName from '../../lib/getFieldClassName';

const DatasetColumn = ({ column, columns, resource }) => (
    <TableCell
        className={classnames(
            'dataset-column',
            `dataset-${getFieldClassName(column)}`,
        )}
    >
        <Format
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
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

export default DatasetColumn;
