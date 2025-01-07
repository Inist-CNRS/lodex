import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { withRouter } from 'react-router';

// @see https://reacttraining.com/react-router/web/guides/scroll-restoration/scroll-to-top
const ScrollToTop = ({ children, location: { pathname } }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return children || null;
};

ScrollToTop.propTypes = {
    children: PropTypes.node,
    location: PropTypes.shape({
        pathname: PropTypes.string,
    }),
};

export default withRouter(ScrollToTop);
