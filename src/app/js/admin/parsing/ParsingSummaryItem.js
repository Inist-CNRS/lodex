import React, { PropTypes } from 'react';
import { grey500, grey800 } from 'material-ui/styles/colors';

const styles = {
    ParsingSummaryItemContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    ParsingSummaryItemCount: (color = grey800) => ({
        color,
    }),
    ParsingSummaryItemLabel: (color = grey500) => ({
        color,
    }),
};

const ParsingSummaryItem = ({ count, label, color }) => (
    <div style={styles.ParsingSummaryItemContainer}>
        <b style={styles.ParsingSummaryItemCount(color)}>{count}</b>
        <small style={styles.ParsingSummaryItemLabel(color)}>{label}</small>
    </div>
);

ParsingSummaryItem.propTypes = {
    color: PropTypes.string,
    count: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
};

ParsingSummaryItem.defaultProps = {
    color: undefined,
};

export default ParsingSummaryItem;
