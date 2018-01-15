import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { field as fieldPropTypes } from '../../propTypes';

const isURL = v =>
    (typeof v === 'string' &&
        (v.startsWith('http://') || v.startsWith('https://'))) ||
    false;

class Redirect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
        };
    }

    componentDidMount() {
        const { field, resource } = this.props;
        const value = resource[field.name];
        const values = Array.isArray(value) ? value : [value];
        const URLs = values.filter(v => isURL(v));
        const url = URLs.pop();

        if (url) {
            this.setState({ url });
            window.location.href = url;
        }
    }

    render() {
        const { url } = this.state;
        const { className } = this.props;
        if (url) {
            return (
                <div className={className}>Try to redirect to {url} ... </div>
            );
        } else {
                return (
                    <div/>
            );

        }
    }
}

Redirect.propTypes = {
    field: fieldPropTypes.isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object.isRequired, // eslint-disable-line
    className: PropTypes.string,
};

Redirect.defaultProps = {
    className: null,
};

export default translate(Redirect);
