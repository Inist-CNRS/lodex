import React, { PropTypes } from 'react';
import withHandlers from 'recompose/withHandlers';
import Chip from 'material-ui/Chip/Chip';

export const WidgetsSelectFieldItem = ({ value, label, onRemove }) => (
    <Chip key={value} style={{ margin: 5 }} onRequestDelete={onRemove}>
        {label}
    </Chip>
);

WidgetsSelectFieldItem.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onRemove: PropTypes.func.isRequired,
};

export default withHandlers({
    onRemove: ({ onRemove, value }) => () => {
        onRemove(value);
    },
})(WidgetsSelectFieldItem);
