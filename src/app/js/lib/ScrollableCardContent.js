import React, { PropTypes } from 'react';
import { CardText } from 'material-ui/Card';

const styles = {
    cardText: {
        paddingTop: 0,
    },
};

const ScrollableCardContent = ({ children, style, ...props }) => (
    <CardText style={Object.assign({}, styles.cardText, style)} {...props}>
        {children}
    </CardText>
);

ScrollableCardContent.propTypes = {
    style: PropTypes.object, // eslint-disable-line
    children: PropTypes.node.isRequired,
};

export default ScrollableCardContent;
