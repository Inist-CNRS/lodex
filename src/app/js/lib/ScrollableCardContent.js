import React, { PropTypes } from 'react';
import { CardText } from 'material-ui/Card';

const styles = {
    cardText: {
        paddingTop: 0,
    },
    container: {
        overflowX: 'auto',
        width: '96vw',
    },
};

const ScrollableCardContent = ({ children, ...props }) => (
    <CardText style={styles.cardText} {...props}>
        <div style={styles.container}>
            {children}
        </div>
    </CardText>
);

ScrollableCardContent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ScrollableCardContent;
