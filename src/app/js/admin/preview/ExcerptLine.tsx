import React from 'react';
import PropTypes from 'prop-types';
import { TableRow } from '@mui/material';

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

// @ts-expect-error TS7031
const ExcerptLine = ({ columns, line, readonly }) => (
    <TableRow sx={styles.row}>
        {/*
         // @ts-expect-error TS7006 */}
        {columns.map((col) => (
            <ExcerptLineCol
                key={`${line.uri}_${col.name}`}
                // @ts-expect-error TS2322
                field={col}
                line={line}
                readonly={readonly}
            />
        ))}
    </TableRow>
);

ExcerptLine.propTypes = {
    columns: PropTypes.arrayOf(fieldPropTypes).isRequired,
    line: linePropTypes.isRequired,
    readonly: PropTypes.bool,
};

export default ExcerptLine;
