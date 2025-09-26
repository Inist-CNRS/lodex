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

Favicon.propTypes = {
    className: PropTypes.string,
};

Favicon.defaultProps = {
    className: null,
};

export default Favicon;
