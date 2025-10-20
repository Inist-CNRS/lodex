// @ts-expect-error TS6133
import React, { Component } from 'react';

interface FaviconProps {
    className?: string;
}

class Favicon extends Component<FaviconProps> {
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

// @ts-expect-error TS2339
Favicon.defaultProps = {
    className: null,
};

export default Favicon;
