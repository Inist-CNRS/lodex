import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { TableBody } from '@material-ui/core';

import OntologyField from './OntologyField';
import { COVER_DATASET } from '../../../../common/cover';

const OntologyFieldList = SortableContainer(({ items }) => (
    <TableBody displayRowCheckbox={false}>
        {items.map(field => (
            <OntologyField
                key={field.name}
                field={field}
                index={field.position}
                collection={
                    field.cover === COVER_DATASET ? 'dataset' : 'document'
                }
                disabled={field.name === 'uri'}
            />
        ))}
    </TableBody>
));

OntologyFieldList.muiName = 'TableBody'; // tell material-ui that this component is TableBody

export default OntologyFieldList;
