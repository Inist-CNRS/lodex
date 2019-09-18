import React from 'react';
import PropTypes from 'prop-types';
import { FormatLineSpacing as Reorder } from '@material-ui/icons';
import { SortableHandle } from 'react-sortable-hoc';
import { grey400 } from 'material-ui/styles/colors';

const styles = {
    iconDisabled: {
        cursor: 'default',
        color: grey400,
    },
    icon: {
        cursor: 'pointer',
    },
};

const DragIcon = ({ disabled }) => (
    <Reorder style={disabled ? styles.iconDisabled : styles.icon} />
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
