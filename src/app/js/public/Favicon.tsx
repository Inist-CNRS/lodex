// @ts-expect-error TS6133
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Favicon extends Component {
    state = {
        error: false,
    };

    handleError = () => {
        this.setState({ error: true });
    };

    render() {
        // @ts-expect-error TS2339
        const { className } = this.props;
        const { error } = this.state;

        if (error) {
            return null;
        }

        return (
            <img
                className={className}
                src="/favicon.ico"
                onError={this.handleError}
            />
        );
    }
}

// @ts-expect-error TS2339
Favicon.propTypes = {
    className: PropTypes.string,
};

// @ts-expect-error TS2339
Favicon.defaultProps = {
    className: null,
};

export default Favicon;
