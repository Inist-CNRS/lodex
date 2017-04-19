import React, { PropTypes } from 'react';
import withHandlers from 'recompose/withHandlers';
import Chip from 'material-ui/Chip/Chip';
import classnames from 'classnames';

import getFieldClassName from '../lib/getFieldClassName';

const styles = {
    chip: { margin: 5 },
};

export const WidgetsSelectFieldItemComponent = ({ value, label, onRemove }) => (
    <Chip
        className={classnames('widget-selected-field-item', getFieldClassName({ label }))}
        key={value}
        style={styles.chip}
        onRequestDelete={onRemove}
    >
        {label}
    </Chip>
);

WidgetsSelectFieldItemComponent.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onRemove: PropTypes.func.isRequired,
};

export default withHandlers({
    onRemove: ({ onRemove, value }) => () => {
        onRemove(value);
    },
})(WidgetsSelectFieldItemComponent);
