import React, { PropTypes } from 'react';
import {
    TableHeaderColumn,
} from 'material-ui/Table';

const DatasetColumnHeader = ({ name, label }) => (
    <TableHeaderColumn key={name}>{label}</TableHeaderColumn>
);

DatasetColumnHeader.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};

export default DatasetColumnHeader;
