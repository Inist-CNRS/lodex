import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import ArrowUp from '@material-ui/icons/ArrowUpward';
import withHandlers from 'recompose/withHandlers';
import { isLongText, getShortText } from '../../lib/longTexts';

const styles = {
    sortButton: {
        minWidth: 40,
    },
    iconSortBy: {
        transition: 'transform 100ms ease-in-out',
    },
    ASC: {},
    DESC: {
        transform: 'rotate(180deg)',
    },
};

const SortButton = ({ name, label, sortBy, sortDir, sort }) => (
    <Button
        variant="text"
        className={`sort_${name}`}
        onClick={sort}
        endIcon={
            sortBy === name && (
                <ArrowUp
                    style={Object.assign(
                        {},
                        styles.iconSortBy,
                        styles[sortDir],
                    )}
                />
            )
        }
        style={styles.sortButton}
    >
        {isLongText(label) ? getShortText(label) : label}
    </Button>
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
