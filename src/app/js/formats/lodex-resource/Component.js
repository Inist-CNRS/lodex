import React, { Component, PropTypes } from 'react';
import fetch from 'isomorphic-fetch';
import translate from 'redux-polyglot/translate';
import url from 'url';
import { field as fieldPropTypes } from '../../propTypes';


class LodexResource extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            uri: '',

        };
    }

    componentDidMount() {
        const { field, resource } = this.props;
        const targetURI = url.parse(resource[field.name]);
        const originalURI = url.parse(resource[field.name]);
        targetURI.query = {
            uri: targetURI.path.slice(1),
        };
        if (!targetURI.host) {
            targetURI.host = window.location.host;
            targetURI.protocol = window.location.protocol;
            targetURI.query.uri = resource[field.name];
        }
        targetURI.pathname = '/api/export/min';

        let originalURL = url.format(originalURI);
        if (!originalURI.host) {
            originalURL = '//'.concat(window.location.host).concat('/').concat(resource[field.name]);
        }
        const targetURL = url.format(targetURI);
        console.log('targetURI', targetURI);
        console.log('originalURL', originalURL);
        fetch(targetURL)
            .then((response) => {
                if (response.status >= 400) {
                    throw new Error('Bad response from server');
                }
                return response.json().then((json) => {
                    const { value } = json.shift();
                    const title = value || originalURL;
                    this.setState({
                        title,
                        uri: originalURL,
                    });
                });
            });
    }

    render() {
        const { uri, title } = this.state;
        return (
            <a href={uri}>{title}</a>
        );
    }
}


LodexResource.propTypes = {
    field: fieldPropTypes.isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

LodexResource.defaultProps = {
    className: null,
};

export default translate(LodexResource);

