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
        const uri = url.parse(resource[field.name]);
        uri.query = {
            uri: uri.path.slice(1),
        };
        uri.pathname = '/api/export/min';
        const apiurl = url.format(uri);
        fetch(apiurl)
            .then((response) => {
                if (response.status >= 400) {
                    throw new Error('Bad response from server');
                }
                return response.json().then((json) => {
                    const { value } = json.shift();
                    const title = value || uri;
                    console.log('title/uri', title, uri);
                    this.setState({
                        title,
                        uri,
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

