import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { TableBody } from 'material-ui/Table';

import OntologyField from './OntologyField';

const OntologyFieldList = SortableContainer(({ items }) => (
    <TableBody>
        {items.map((field, index) => (
            <OntologyField
                key={field.name}
                field={field}
                index={index}
                disabled={index === 0}
                sortIndex={index}
            />
        ))}
    </TableBody>
));

OntologyFieldList.muiName = 'TableBody'; // tell material-ui that this component is TableBody

export default OntologyFieldList;
