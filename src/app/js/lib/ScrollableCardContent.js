import React, { PropTypes } from 'react';
import { CardText } from 'material-ui/Card';

const styles = {
    container: {
        overflowX: 'auto',
        width: '96vw',
    },
};

const ScrollableCardContent = ({ children, style, ...props }) => (
    <CardText {...props}>
        <div style={styles.container}>
            {children}
        </div>
    </CardText>
);

ScrollableCardContent.propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object, // eslint-disable-line
};

export default ScrollableCardContent;
