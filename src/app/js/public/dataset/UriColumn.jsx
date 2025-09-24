import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { TableCell, Button } from '@mui/material';
import RightIcon from '@mui/icons-material/KeyboardArrowRight';

import { field as fieldPropTypes } from '../../propTypes';
import { getResourceUri } from '../../../../common/uris';
import Link from '../../lib/components/Link';

const UriColumn = ({ column, resource, indice }) => (
    <TableCell
        className={classnames('dataset-column', `dataset-${column.name}`)}
    >
        <Button
            variant="text"
            component={(props) => (
                <Link to={getResourceUri(resource)} {...props} />
            )}
            startIcon={<RightIcon />}
        >
            {indice}
        </Button>
    </TableCell>
);

UriColumn.propTypes = {
    column: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    indice: PropTypes.number,
};

export default UriColumn;
