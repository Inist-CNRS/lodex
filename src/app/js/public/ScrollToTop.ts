import { useEffect } from 'react';
import { withRouter } from 'react-router';

interface ScrollToTopProps {
    children?: React.ReactNode;
    location: {
        pathname?: string;
    };
}

// @see https://reacttraining.com/react-router/web/guides/scroll-restoration/scroll-to-top
const ScrollToTop = ({
    children,
    location: { pathname },
}: ScrollToTopProps) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return children || null;
};

export default withRouter(ScrollToTop);
