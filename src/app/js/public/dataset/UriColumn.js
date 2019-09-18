import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, TableRowColumn } from '@material-ui/core';
import { KeyboardArrowRight as RightIcon } from '@material-ui/icons';

import { field as fieldPropTypes } from '../../propTypes';
import { getResourceUri } from '../../../../common/uris';
import Link from '../../lib/components/Link';

const UriColumn = ({ column, resource, indice }) => (
    <TableRowColumn
        className={classnames('dataset-column', `dataset-${column.name}`)}
    >
        <Button
            labelPosition="after"
            label={indice}
            containerElement={<Link to={getResourceUri(resource)} />}
            icon={<RightIcon />}
        />
    </TableRowColumn>
);

UriColumn.propTypes = {
    column: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
    indice: PropTypes.number, // eslint-disable-line
};

export default UriColumn;
