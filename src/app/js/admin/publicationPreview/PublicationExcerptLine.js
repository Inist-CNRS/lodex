import React, { PropTypes } from 'react';
import { TableRow } from 'material-ui/Table';

import { field as fieldPropTypes, resource as linePropTypes } from '../../propTypes';
import PublicationExcerptLineCol from './PublicationExcerptLineCol';

const styles = {
    row: {
        height: 36,
    },
};

const PublicationExcerptLine = ({
    columns,
    line,
}) => (
    <TableRow displayBorder={false} style={styles.row}>
        {columns.map(col => (
            <PublicationExcerptLineCol key={`${line.uri}_${col.name}`} field={col} line={line} />
        ))}
    </TableRow>
);

PublicationExcerptLine.propTypes = {
    columns: PropTypes.arrayOf(fieldPropTypes).isRequired,
    line: linePropTypes.isRequired,
};

export default PublicationExcerptLine;
