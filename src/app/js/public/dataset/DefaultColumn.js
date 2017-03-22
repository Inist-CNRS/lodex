import React, { PropTypes } from 'react';
import classnames from 'classnames';

import { TableRowColumn } from 'material-ui/Table';
import Format from '../Format';
import { field as fieldPropTypes } from '../../propTypes';

const DatasetColumn = ({ column, columns, resource }) => (
    <TableRowColumn
        className={classnames('dataset-column', `dataset-${column.label.toLowerCase().replace(/\s/g, '_')}`)}
    >
        <Format
            field={column}
            fields={columns}
            resource={resource}
        />
    </TableRowColumn>
);

DatasetColumn.propTypes = {
    column: fieldPropTypes.isRequired,
    columns: PropTypes.arrayOf(fieldPropTypes).isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

export default DatasetColumn;
