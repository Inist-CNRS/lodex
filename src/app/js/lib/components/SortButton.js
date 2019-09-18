import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import { Sort as ContentSort } from '@material-ui/icons';
import withHandlers from 'recompose/withHandlers';
import { isLongText, getShortText } from '../../lib/longTexts';

const styles = {
    sortButton: {
        minWidth: 40,
    },
    ASC: { transform: 'rotate(180deg)' },
    DESC: {},
};

const SortButton = ({ name, label, sortBy, sortDir, sort }) => (
    <FlatButton
        className={`sort_${name}`}
        labelPosition="before"
        onClick={sort}
        label={isLongText(label, 15) ? getShortText(label, 15) : label}
        icon={sortBy === name && <ContentSort style={styles[sortDir]} />}
        style={styles.sortButton}
    />
);

SortButton.defaultProps = {
    sortBy: null,
    sortDir: null,
};

SortButton.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    sortDir: PropTypes.oneOf(['ASC', 'DESC']),
    sortBy: PropTypes.string,
    sort: PropTypes.func.isRequired,
};

export default withHandlers({
    sort: ({ sort, name }) => () => sort(name),
})(SortButton);
