import React from 'react';
import PropTypes from 'prop-types';
import { Fab, Tooltip } from '@material-ui/core';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/pure';

const styles = {
    container: {
        position: 'relative',
    },
};

export const FloatingActionButtonComponent = ({
    children,
    handleMouseEnter,
    handleMouseLeave,
    setShowTooltip,
    showTooltip,
    style,
    tooltip,
    ...props
}) => {
    const button = (
        <Fab
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {children}
        </Fab>
    );

    return (
        <div style={{ ...styles.container, ...style }}>
            {tooltip ? (
                <Tooltip
                    open={showTooltip}
                    title={tooltip}
                    placement="left-end"
                    touch
                >
                    {button}
                </Tooltip>
            ) : (
                button
            )}
        </div>
    );
};

FloatingActionButtonComponent.propTypes = {
    children: PropTypes.node.isRequired,
    handleMouseEnter: PropTypes.func.isRequired,
    handleMouseLeave: PropTypes.func.isRequired,
    setShowTooltip: PropTypes.func.isRequired,
    showTooltip: PropTypes.bool.isRequired,
    style: PropTypes.object,
    tooltip: PropTypes.string,
};

FloatingActionButtonComponent.defaultProps = {
    style: null,
    tooltip: null,
};

export default compose(
    withState('showTooltip', 'setShowTooltip', false),
    withHandlers({
        handleMouseEnter: ({ setShowTooltip }) => () => setShowTooltip(true),
        handleMouseLeave: ({ setShowTooltip }) => () => setShowTooltip(false),
    }),
    pure,
)(FloatingActionButtonComponent);
