import React, { PropTypes } from 'react';
import { TableRow } from 'material-ui/Table';

import { field as fieldPropTypes, resource as linePropTypes } from '../../propTypes';
import ExcerptLineCol from './ExcerptLineCol';

const styles = {
    row: {
        height: 36,
    },
};

const ExcerptLine = ({
    columns,
    line,
}) => (
    <TableRow displayBorder={false} style={styles.row}>
        {columns.map(col => (
            <ExcerptLineCol key={`${line.uri}_${col.name}`} field={col} line={line} />
        ))}
    </TableRow>
);

ExcerptLine.propTypes = {
    columns: PropTypes.arrayOf(fieldPropTypes).isRequired,
    line: linePropTypes.isRequired,
};

export default ExcerptLine;
