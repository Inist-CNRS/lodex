import React, { PropTypes } from 'react';
import { CardText } from 'material-ui/Card';
import memoize from 'lodash.memoize';

const styles = {
    cardText: memoize(style => Object.assign({
        paddingTop: 0,
    }, style)),
};

const ScrollableCardContent = ({ children, style, ...props }) => (
    <CardText style={styles.cardText(style)} {...props}>
        {children}
    </CardText>
);

ScrollableCardContent.propTypes = {
    style: PropTypes.object, // eslint-disable-line
    children: PropTypes.node.isRequired,
};

export default ScrollableCardContent;
