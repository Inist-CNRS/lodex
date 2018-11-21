import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { field as fieldPropTypes } from '../../propTypes';

class RedirectView extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { field, resource } = this.props;
        const url = resource[field.name];
        window.location.href = url;
    }

    render() {
        const { field, resource, className } = this.props;
        const url = resource[field.name];
        return (
            <div className={className}>
                <Helmet>
                    <link rel="canonical" href={url} />
                </Helmet>
                <a href={url}>{url}</a>
            </div>
        );
    }
}

RedirectView.propTypes = {
    field: fieldPropTypes.isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object.isRequired, // eslint-disable-line
    className: PropTypes.string,
};

RedirectView.defaultProps = {
    className: null,
};

export default RedirectView;
