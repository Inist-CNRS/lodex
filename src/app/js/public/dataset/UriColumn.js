import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { TableRowColumn } from 'material-ui/Table';
import { field as fieldPropTypes } from '../../propTypes';

const UriColumn = ({ column, resource }) => (
    <TableRowColumn className={classnames('dataset-column', `dataset-${column.name}`)}>
        <Link to={`/resource?uri=${resource[column.name]}`}>{resource[column.name]}</Link>
    </TableRowColumn>
);

UriColumn.propTypes = {
    column: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

export default UriColumn;
