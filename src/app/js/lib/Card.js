import React, { PropTypes } from 'react';
import { Card } from 'material-ui/Card';

const getStyles = style => ({
    marginTop: '0.5rem',
    ...style,
});

const CardComponent = ({ children, style, ...props }) => (
    <Card
        style={getStyles(style)}
        {...props}
    >
        {children}
    </Card>
);

CardComponent.propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object.isRequired, // eslint-disable-line
};

export default CardComponent;

