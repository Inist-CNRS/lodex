import React from 'react';
import PropTypes from 'prop-types';
import Reorder from '@material-ui/icons/FormatLineSpacing';
import { SortableHandle } from 'react-sortable-hoc';
import { grey } from '@material-ui/core/colors';

import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        icon: {
            cursor: 'pointer',
        },
        iconDisabled: {
            cursor: 'default',
            color: grey[400],
        },
    },
    'ontology-drag-button',
);

const DragIcon = ({ disabled }) => (
    <Reorder className={disabled ? styles.iconDisabled : styles.icon} />
);

DragIcon.propTypes = {
    disabled: PropTypes.bool,
};

const DragHandle = SortableHandle(DragIcon);

const DragButton = ({ disabled }) => (
    <span className="drag-handle">
        {disabled ? <DragIcon disabled={disabled} /> : <DragHandle />}
    </span>
);

DragButton.propTypes = {
    disabled: PropTypes.bool,
};

export default DragButton;
