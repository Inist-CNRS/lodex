import React from 'react';
import PropTypes from 'prop-types';
import { Fab } from '@material-ui/core';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/pure';
import Tooltip from './Tooltip';

const styles = {
    container: {
        position: 'relative',
    },
    tooltip: {},
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
}) => (
    <div style={Object.assign({}, styles.container, style)}>
        <Fab
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {children}
        </Fab>
        {tooltip && (
            <Tooltip
                show={showTooltip}
                label={tooltip}
                style={styles.tooltip}
                horizontalPosition="left"
                verticalPosition="middle"
                touch
            />
        )}
    </div>
);

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
