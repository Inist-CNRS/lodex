import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { TableRow } from 'material-ui/Table';

import { field as fieldPropTypes, resource as linePropTypes } from '../../propTypes';
import PublicationExcerptLineCol from './PublicationExcerptLineCol';

export const PublicationExcerptLineComponent = ({
    columns,
    line,
}) => (
    <TableRow>
        {columns.map(col => (
            <PublicationExcerptLineCol key={`${line.uri}_${col.name}`} field={col} line={line} />
        ))}
    </TableRow>
);

PublicationExcerptLineComponent.propTypes = {
    columns: PropTypes.arrayOf(fieldPropTypes).isRequired,
    line: linePropTypes.isRequired,
};

export default compose(
    translate,
)(PublicationExcerptLineComponent);
