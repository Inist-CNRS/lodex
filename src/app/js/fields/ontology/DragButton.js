import React from 'react';
import PropTypes from 'prop-types';
import { SortableHandle } from 'react-sortable-hoc';
import { grey400 } from 'material-ui/styles/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';

import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        icon: {
            cursor: 'pointer',
        },
        iconDisabled: {
            cursor: 'default',
            color: grey400,
        },
    },
    'ontology-drag-button',
);

const DragIcon = ({ disabled }) => (
    <FontAwesomeIcon
        icon={faGripVertical}
        className={disabled ? styles.iconDisabled : styles.icon}
    />
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
