import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { TableRowColumn } from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { field as fieldPropTypes } from '../../propTypes';
import { getResourceUri } from '../../../../common/uris';
import Link from '../../lib/components/Link';

const UriColumn = ({ column, resource, indice }) => (
    <TableRowColumn
        className={classnames('dataset-column', `dataset-${column.name}`)}
    >
        <Button component={<Link to={getResourceUri(resource)} />}>
            {indice}
            {<FontAwesomeIcon icon={faChevronRight} />}
        </Button>
    </TableRowColumn>
);

UriColumn.propTypes = {
    column: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    indice: PropTypes.number,
};

export default UriColumn;
