import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import ArrowUp from '@mui/icons-material/ArrowUpward';
// @ts-expect-error TS7016
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

// @ts-expect-error TS7031
const SortButton = ({ name, children, sortBy, sortDir, sort }) => (
    <Button
        variant="text"
        // @ts-expect-error TS2769
        color="text"
        className={`sort_${name}`}
        onClick={sort}
        sx={styles.sortButton}
    >
        {isLongText(children) ? getShortText(children) : children}
        {sortBy === name && (
            <ArrowUp
                sx={{
                    ...styles.iconSortBy,
                    // @ts-expect-error TS7053
                    ...styles[sortDir],
                }}
            />
        )}
    </Button>
);

SortButton.defaultProps = {
    sortBy: null,
    sortDir: null,
};

SortButton.propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.string.isRequired,
    sortDir: PropTypes.oneOf(['ASC', 'DESC']),
    sortBy: PropTypes.string,
    sort: PropTypes.func.isRequired,
};

export default withHandlers({
    sort:
        // @ts-expect-error TS7031


            ({ sort, name }) =>
            () =>
                sort(name),
})(SortButton);
