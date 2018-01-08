import React from 'react';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import Reorder from 'material-ui/svg-icons/editor/format-line-spacing';
import { SortableHandle } from 'react-sortable-hoc';

const DragIcon = ({ disabled }) => (
    <IconButton disabled={disabled}>
        <Reorder />
    </IconButton>
);

DragIcon.propTypes = {
    disabled: PropTypes.bool,
};

const DragHandle = SortableHandle(DragIcon);

const DragButton = ({ disabled }) =>
    disabled ? <DragIcon disabled={disabled} /> : <DragHandle />;

DragButton.propTypes = {
    disabled: PropTypes.bool,
};

export default DragButton;
