import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, TableCell } from '@material-ui/core';
import { KeyboardArrowRight as RightIcon } from '@material-ui/icons';

import { field as fieldPropTypes } from '../../propTypes';
import { getResourceUri } from '../../../../common/uris';
import Link from '../../lib/components/Link';

const UriColumn = ({ column, resource, indice }) => (
    <TableCell
        className={classnames('dataset-column', `dataset-${column.name}`)}
    >
        <Button
            labelPosition="after"
            label={indice}
            containerElement={<Link to={getResourceUri(resource)} />}
            icon={<RightIcon />}
        />
    </TableCell>
);

UriColumn.propTypes = {
    column: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
    indice: PropTypes.number, // eslint-disable-line
};

export default UriColumn;
