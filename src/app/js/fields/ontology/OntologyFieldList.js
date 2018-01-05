import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { TableBody, TableRow } from 'material-ui/Table';

import OntologyField from './OntologyField';
import { COVER_DATASET } from '../../../../common/cover';

const OntologyFieldList = SortableContainer(({ items, filter }) => (
    <TableBody displayRowCheckbox={false}>
        {items
            .filter(
                field =>
                    (filter === 'all' || filter === COVER_DATASET) &&
                    field.cover === COVER_DATASET,
            )
            .map(field => (
                <OntologyField
                    key={field.name}
                    field={field}
                    index={field.position}
                    collection={
                        field.cover === COVER_DATASET ? 'dataset' : 'document'
                    }
                    disabled={field.position === 0}
                />
            ))}
        <TableRow />
        {items
            .filter(
                field =>
                    (filter === 'all' || filter !== COVER_DATASET) &&
                    field.cover !== COVER_DATASET,
            )
            .map(field => (
                <OntologyField
                    key={field.name}
                    field={field}
                    index={field.position}
                    collection={
                        field.cover === COVER_DATASET ? 'dataset' : 'document'
                    }
                    disabled={field.position === 0}
                />
            ))}
    </TableBody>
));

OntologyFieldList.muiName = 'TableBody'; // tell material-ui that this component is TableBody

export default OntologyFieldList;
