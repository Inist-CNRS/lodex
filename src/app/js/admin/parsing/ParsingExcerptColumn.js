import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { CircularProgress, TableCell } from '@material-ui/core';
import { isLongText, getShortText } from '../../lib/longTexts';

const styles = {
    col: {
        position: 'relative',
        minWidth: '10rem',
        overflow: 'visible',
        height: '5rem',
    },
};

export const ParsingExcerptColumnComponent = ({
    children,
    style,
    value,
    isEnrichmentLoading,
}) => (
    <TableCell style={{ ...styles.col, ...style }} title={value}>
        {isEnrichmentLoading && value === undefined ? (
            <>
                <CircularProgress
                    variant="indeterminate"
                    style={styles.progress}
                    size={20}
                />
            </>
        ) : (
            <>
                {isLongText(value) ? getShortText(value) : `${value}`}
                {children}
            </>
        )}
    </TableCell>
);

ParsingExcerptColumnComponent.propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isEnrichmentLoading: PropTypes.bool,
};

ParsingExcerptColumnComponent.defaultProps = {
    children: null,
    style: null,
};

export default pure(ParsingExcerptColumnComponent);
