import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

// @see https://reacttraining.com/react-router/web/guides/scroll-restoration/scroll-to-top
class ScrollToTop extends Component {
    static propTypes = {
        location: PropTypes.string.isRequired,
    };

    componentDidUpdate(prevProps) {
        if (
            typeof window !== 'undefined' &&
            this.props.location !== prevProps.location
        ) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return null;
    }
}

export default withRouter(ScrollToTop);
