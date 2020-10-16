import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { TableCell, Button } from '@material-ui/core';
import RightIcon from '@material-ui/icons/KeyboardArrowRight';

import { field as fieldPropTypes } from '../../propTypes';
import { getResourceUri } from '../../../../common/uris';
import Link from '../../lib/components/Link';

const UriColumn = ({ column, resource, indice }) => (
    <TableCell
        className={classnames('dataset-column', `dataset-${column.name}`)}
    >
        <Button
            variant="text"
            containerElement={<Link to={getResourceUri(resource)} />}
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
