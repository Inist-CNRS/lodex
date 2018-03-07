import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';
import { TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import RightIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

import { field as fieldPropTypes } from '../../propTypes';
import { getResourceUri } from '../../../../common/uris';

const UriColumn = ({ column, resource, indice }) => (
    <TableRowColumn
        className={classnames('dataset-column', `dataset-${column.name}`)}
    >
        <FlatButton
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
