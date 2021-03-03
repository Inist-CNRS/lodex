import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { TableBody } from '@material-ui/core';

import OntologyField from './OntologyField';

const OntologyFieldList = SortableContainer(({ items }) => (
    <TableBody>
        {items.map(field => (
            <OntologyField
                key={field.name}
                field={field}
                index={field.position}
                collection="DRAG_GROUP" // make it dynamic to group by draggable zone
                disabled={field.name === 'uri'}
            />
        ))}
    </TableBody>
));

OntologyFieldList.muiName = 'TableBody'; // tell material-ui that this component is TableBody

export default OntologyFieldList;
