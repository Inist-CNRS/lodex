import React, { PropTypes } from 'react';
import classnames from 'classnames';

import { TableRowColumn } from 'material-ui/Table';
import Format from '../Format';
import { field as fieldPropTypes } from '../../propTypes';
import getFieldClassName from '../../lib/getFieldClassName';

const DatasetColumn = ({ column, columns, resource }) => (
    <TableRowColumn
        className={classnames('dataset-column', `dataset-${getFieldClassName(column)}`)}
    >
        <Format
            field={column}
            fields={columns}
            resource={resource}
            shrink
        />
    </TableRowColumn>
);

DatasetColumn.propTypes = {
    column: fieldPropTypes.isRequired,
    columns: PropTypes.arrayOf(fieldPropTypes).isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

export default DatasetColumn;
