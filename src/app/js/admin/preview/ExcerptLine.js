import React from 'react';
import PropTypes from 'prop-types';
import { TableRow } from '@material-ui/core/Table';

import {
    field as fieldPropTypes,
    resource as linePropTypes,
} from '../../propTypes';
import ExcerptLineCol from './ExcerptLineCol';

const styles = {
    row: {
        height: 36,
    },
};

const ExcerptLine = ({ columns, line }) => (
    <TableRow displayBorder={false} style={styles.row}>
        {columns.map(col => (
            <ExcerptLineCol
                key={`${line.uri}_${col.name}`}
                field={col}
                line={line}
            />
        ))}
    </TableRow>
);

ExcerptLine.propTypes = {
    columns: PropTypes.arrayOf(fieldPropTypes).isRequired,
    line: linePropTypes.isRequired,
};

export default ExcerptLine;
