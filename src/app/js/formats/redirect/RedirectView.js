import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { field as fieldPropTypes } from '../../propTypes';
import { isURL } from '../../../../common/uris.js';

class RedirectView extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { field, resource } = this.props;
        const value = resource[field.name];
        const values = Array.isArray(value) ? value : [value];
        const URLs = values.filter(v => isURL(v));
        const url = URLs.pop();

        if (url) {
            window.location.href = url;
        }
    }

    render() {
        const { field, resource, className } = this.props;
        return <span className={className}>{resource[field.name]}</span>;
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
